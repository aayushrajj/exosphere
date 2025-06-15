
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
        console.log('No organization ID provided, skipping executives fetch');
        setExecutives([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching executives for organization:', organizationId);
        
        // Get current user for debugging
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user ID:', user?.id);

        if (!user) {
          console.log('No authenticated user found');
          setExecutives([]);
          setLoading(false);
          return;
        }

        // First verify the user belongs to this organization
        const { data: userOrgCheck, error: userOrgError } = await supabase
          .from('user_organizations')
          .select('user_id')
          .eq('organization_id', organizationId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (userOrgError) {
          console.error('Error checking user organization membership:', userOrgError);
          setExecutives([]);
          setLoading(false);
          return;
        }

        if (!userOrgCheck) {
          console.log('User is not a member of this organization');
          setExecutives([]);
          setLoading(false);
          return;
        }

        // Fetch the executive data
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
          setExecutives([]);
          setLoading(false);
          return;
        }

        console.log('Raw executives data:', executivesData);

        if (executivesData && executivesData.length > 0) {
          // Now fetch profiles for each user
          const formattedExecutives = await Promise.all(
            executivesData.map(async (exec) => {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', exec.user_id)
                .maybeSingle();

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

          console.log('Formatted executives:', formattedExecutives);
          setExecutives(formattedExecutives);
        } else {
          console.log('No executives found for organization');
          setExecutives([]);
        }
      } catch (error) {
        console.error('Error fetching organization executives:', error);
        setExecutives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutives();
  }, [organizationId]);

  return { executives, loading };
};
