
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name?: string;
  onboarding_completed: boolean;
}

interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  executive_role: string;
  organization?: {
    id: string;
    name: string;
    founding_year?: number;
    domain?: string;
    description: string;
    org_code: string;
  };
}

export const useOnboardingStatus = () => {
  const checkOnboardingStatus = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        return { needsOnboarding: true, profile: null };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking onboarding status:', profileError);
        return { needsOnboarding: true, profile: null };
      }

      return {
        needsOnboarding: !profile?.onboarding_completed,
        profile
      };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return { needsOnboarding: true, profile: null };
    }
  };

  const getUserOrganization = async (): Promise<UserOrganization | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found:', userError);
        return null;
      }

      const { data: userOrg, error: orgError } = await supabase
        .from('user_organizations')
        .select(`
          *,
          organizations!user_organizations_organization_id_fkey(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (orgError) {
        console.error('Error getting user organization:', orgError);
        return null;
      }

      return userOrg;
    } catch (error) {
      console.error('Error getting user organization:', error);
      return null;
    }
  };

  return {
    checkOnboardingStatus,
    getUserOrganization,
  };
};
