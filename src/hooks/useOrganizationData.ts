
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Executive {
  id: string;
  full_name: string;
  executive_role: string;
  created_at: string;
}

interface OrganizationData {
  name: string;
  executives: Executive[];
}

export const useOrganizationData = () => {
  const [userName, setUserName] = useState('User');
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.full_name) {
            const firstName = profile.full_name.split(' ')[0];
            setUserName(firstName);
          }

          // Get user's organization
          const { data: userOrg } = await supabase
            .from('user_organizations')
            .select(`
              organization_id,
              organizations!user_organizations_organization_id_fkey(name)
            `)
            .eq('user_id', user.id)
            .single();

          if (userOrg) {
            const orgName = userOrg.organizations.name;

            // Get all executives in the organization
            const { data: executives } = await supabase
              .from('user_organizations')
              .select(`
                user_id,
                executive_role,
                created_at
              `)
              .eq('organization_id', userOrg.organization_id)
              .order('created_at', { ascending: true });

            if (executives) {
              // Fetch profiles separately for each executive
              const executivesWithProfiles = await Promise.all(
                executives.map(async (exec) => {
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

              setOrganizationData({
                name: orgName,
                executives: executivesWithProfiles
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  return { userName, organizationData, loading };
};
