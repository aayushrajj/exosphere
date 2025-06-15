
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
        const { data: executivesData } = await supabase
          .from('user_organizations')
          .select(`
            user_id,
            executive_role,
            created_at
          `)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: true });

        if (executivesData) {
          const executivesWithProfiles = await Promise.all(
            executivesData.map(async (exec) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', exec.user_id)
                .single();

              return {
                id: exec.user_id,
                full_name: profile?.full_name || 'Unknown',
                executive_role: exec.executive_role,
                created_at: exec.created_at
              };
            })
          );

          setExecutives(executivesWithProfiles);
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
