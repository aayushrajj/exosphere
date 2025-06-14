
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrganizationChange {
  id: string;
  action_type: string;
  old_ceo_id?: string;
  new_ceo_id?: string;
  details: any;
  created_at: string;
}

export const useOrganizationChanges = (organizationId?: string) => {
  const { toast } = useToast();
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    if (!organizationId) return;

    const checkForChanges = async () => {
      try {
        const { data: changes, error } = await supabase.rpc('get_recent_organization_changes', {
          org_id: organizationId,
          since_timestamp: lastCheck.toISOString()
        });

        if (error) {
          console.error('Error fetching organization changes:', error);
          return;
        }

        // Process changes and show notifications
        if (changes && changes.length > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          
          changes.forEach((change: OrganizationChange) => {
            if (change.action_type === 'ceo_promoted') {
              if (user && change.new_ceo_id === user.id) {
                toast({
                  title: "You've been promoted to CEO!",
                  description: "You are now the CEO of your organization due to the previous CEO leaving.",
                  duration: 10000,
                });
              }
            }
          });
        }

        setLastCheck(new Date());
      } catch (error) {
        console.error('Error checking organization changes:', error);
      }
    };

    // Check for changes every 30 seconds
    const interval = setInterval(checkForChanges, 30000);
    
    return () => clearInterval(interval);
  }, [organizationId, lastCheck, toast]);

  return null;
};
