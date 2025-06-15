
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Executive {
  id: string;
  full_name: string;
  executive_role: string;
  created_at: string;
}

export const useOrganizationExecutives = (organizationId: string | null) => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutives = async () => {
      if (!organizationId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching executives for organization:', organizationId);
        
        const { data: executivesData, error } = await supabase
          .from('user_organizations')
          .select(`
            user_id,
            executive_role,
            created_at
          `)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching executives data:', error);
          return;
        }

        console.log('Raw executives data:', executivesData);

        if (executivesData && executivesData.length > 0) {
          const executivesWithProfiles = await Promise.all(
            executivesData.map(async (exec) => {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', exec.user_id)
                .single();

              if (profileError) {
                console.error('Error fetching profile for user:', exec.user_id, profileError);
              }

              return {
                id: exec.user_id,
                full_name: profile?.full_name || 'Unknown User',
                executive_role: exec.executive_role,
                created_at: exec.created_at
              };
            })
          );

          console.log('Executives with profiles:', executivesWithProfiles);
          setExecutives(executivesWithProfiles);
        } else {
          console.log('No executives found for organization');
          setExecutives([]);
        }
      } catch (error) {
        console.error('Error fetching organization executives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutives();
  }, [organizationId]);

  return { executives, loading };
};
