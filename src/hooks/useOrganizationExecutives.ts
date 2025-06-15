
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
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching executives for organization:', organizationId);
        
        // Get current user for debugging
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user ID:', user?.id);

        // First, let's check what organization relationships exist
        const { data: allOrgRelationships, error: allOrgError } = await supabase
          .from('user_organizations')
          .select('*')
          .eq('organization_id', organizationId);

        console.log('All organization relationships:', allOrgRelationships);
        if (allOrgError) {
          console.error('Error fetching all organization relationships:', allOrgError);
        }

        // Now fetch the executive data with profiles using a join
        const { data: executivesData, error } = await supabase
          .from('user_organizations')
          .select(`
            user_id,
            executive_role,
            created_at,
            profiles!user_organizations_user_id_fkey(
              full_name
            )
          `)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching executives data:', error);
          setExecutives([]);
          return;
        }

        console.log('Raw executives data with profiles:', executivesData);

        if (executivesData && executivesData.length > 0) {
          const formattedExecutives = executivesData.map((exec) => ({
            id: exec.user_id,
            full_name: exec.profiles?.full_name || 'Unknown User',
            executive_role: exec.executive_role,
            created_at: exec.created_at
          }));

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
