
import { supabase } from '@/integrations/supabase/client';

interface Organization {
  id: string;
  name: string;
  founding_year?: number;
  domain?: string;
  description: string;
  org_code: string;
}

export const useOrganizationValidation = () => {
  const validateOrgCode = async (orgCode: string): Promise<Organization | null> => {
    try {
      if (!orgCode.trim()) {
        return null;
      }

      const { data: organization, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('org_code', orgCode.trim())
        .maybeSingle();

      if (error) {
        console.error('Error validating org code:', error);
        return null;
      }

      return organization;
    } catch (error) {
      console.error('Error validating org code:', error);
      return null;
    }
  };

  return {
    validateOrgCode,
  };
};
