
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { organizationSchema, userInfoSchema, orgCodeSchema } from '@/lib/validationSchemas';
import type { OrganizationData, UserInfoData } from '@/lib/validationSchemas';

export const useOnboardingValidation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const validateOrganizationName = async (name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Client-side validation first
      const nameValidation = organizationSchema.pick({ name: true }).safeParse({ name });
      if (!nameValidation.success) {
        toast({
          title: "Invalid organization name",
          description: nameValidation.error.errors[0].message,
          variant: "destructive",
        });
        return false;
      }

      // Check if organization name already exists
      const { data: exists, error } = await supabase.rpc('check_organization_name_exists', {
        org_name: name
      });

      if (error) {
        console.error('Error checking organization name:', error);
        toast({
          title: "Validation error",
          description: "Failed to validate organization name. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (exists) {
        toast({
          title: "Organization name taken",
          description: "An organization with this name already exists. Please choose a different name.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating organization name:', error);
      toast({
        title: "Validation error",
        description: "Failed to validate organization name. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateOrganizationMemberLimit = async (organizationId: string): Promise<boolean> => {
    try {
      const { data: memberCount, error } = await supabase.rpc('get_organization_member_count', {
        org_id: organizationId
      });

      if (error) {
        console.error('Error checking member count:', error);
        return true; // Allow join if we can't check (fail open)
      }

      if (memberCount >= 20) {
        toast({
          title: "Organization at capacity",
          description: "This organization has reached its maximum of 20 members. Please contact the organization for more details.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating member limit:', error);
      return true; // Allow join if we can't check (fail open)
    }
  };

  const validateUserInfo = (data: UserInfoData): boolean => {
    const validation = userInfoSchema.safeParse(data);
    if (!validation.success) {
      toast({
        title: "Invalid user information",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateOrgCode = (code: string): boolean => {
    const validation = orgCodeSchema.safeParse(code);
    if (!validation.success) {
      toast({
        title: "Invalid organization code",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateOrganizationData = (data: OrganizationData): boolean => {
    const validation = organizationSchema.safeParse(data);
    if (!validation.success) {
      toast({
        title: "Invalid organization data",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    loading,
    validateOrganizationName,
    validateOrganizationMemberLimit,
    validateUserInfo,
    validateOrgCode,
    validateOrganizationData,
  };
};
