
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserOrganization {
  organization_id: string;
  name: string;
}

export const useUserOrganization = () => {
  const [userOrganization, setUserOrganization] = useState<UserOrganization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrganization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userOrg } = await supabase
            .from('user_organizations')
            .select(`
              organization_id,
              organizations!user_organizations_organization_id_fkey(name)
            `)
            .eq('user_id', user.id)
            .single();

          if (userOrg) {
            setUserOrganization({
              organization_id: userOrg.organization_id,
              name: userOrg.organizations.name
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrganization();
  }, []);

  return { userOrganization, loading };
};
