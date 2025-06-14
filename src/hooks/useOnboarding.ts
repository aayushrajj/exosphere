
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  founding_year?: number;
  domain?: string;
  description: string;
  org_code: string;
}

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
  organization?: Organization;
}

export const useOnboarding = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { needsOnboarding: true, profile: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        needsOnboarding: !profile?.onboarding_completed,
        profile
      };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return { needsOnboarding: true, profile: null };
    }
  };

  const validateOrgCode = async (orgCode: string): Promise<Organization | null> => {
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('org_code', orgCode.trim())
        .single();

      if (error || !organization) {
        return null;
      }

      return organization;
    } catch (error) {
      console.error('Error validating org code:', error);
      return null;
    }
  };

  const createOrganization = async (orgData: {
    name: string;
    founding_year?: number;
    domain?: string;
    description: string;
  }): Promise<Organization | null> => {
    try {
      setLoading(true);

      // Check if organization already exists
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('*')
        .eq('name', orgData.name.trim())
        .eq('domain', orgData.domain?.trim() || '')
        .maybeSingle();

      if (existingOrg) {
        toast({
          title: "Organization already exists",
          description: "An organization with this name and domain already exists.",
          variant: "destructive",
        });
        return null;
      }

      const { data: organization, error } = await supabase
        .from('organizations')
        .insert([orgData])
        .select()
        .single();

      if (error) throw error;

      return organization;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error creating organization",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinOrganization = async (organizationId: string, userData: {
    fullName: string;
    executiveRole: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Check if executive role is already taken
      const { data: existingRole } = await supabase
        .from('user_organizations')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('executive_role', userData.executiveRole.trim())
        .maybeSingle();

      if (existingRole) {
        toast({
          title: "Role already assigned",
          description: "This executive role is already assigned in your organization.",
          variant: "destructive",
        });
        return false;
      }

      // Update profile
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: userData.fullName,
          onboarding_completed: true,
        });

      // Create user-organization relationship
      await supabase
        .from('user_organizations')
        .insert({
          user_id: user.id,
          organization_id: organizationId,
          executive_role: userData.executiveRole,
        });

      toast({
        title: "Onboarding completed!",
        description: "Welcome to your organization.",
      });

      return true;
    } catch (error) {
      console.error('Error joining organization:', error);
      toast({
        title: "Error joining organization",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserOrganization = async (): Promise<UserOrganization | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', user.id)
        .single();

      return userOrg;
    } catch (error) {
      console.error('Error getting user organization:', error);
      return null;
    }
  };

  return {
    loading,
    checkOnboardingStatus,
    validateOrgCode,
    createOrganization,
    joinOrganization,
    getUserOrganization,
  };
};
