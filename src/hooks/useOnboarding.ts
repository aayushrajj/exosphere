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
    setLoading(true);
    
    try {
      console.log('Creating organization with data:', orgData);

      // Check if organization with this name already exists
      console.log('Checking for existing organization with name:', orgData.name.trim());
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('*')
        .eq('name', orgData.name.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing organization:', checkError);
        toast({
          title: "Error checking organization",
          description: "Failed to check if organization exists. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (existingOrg) {
        console.log('Organization with this name already exists:', existingOrg);
        toast({
          title: "Organization name already taken",
          description: "An organization with this name already exists. Please choose a different name.",
          variant: "destructive",
        });
        return null;
      }

      console.log('Organization name is available, creating new organization...');
      const { data: organization, error } = await supabase
        .from('organizations')
        .insert([orgData])
        .select()
        .single();

      if (error) {
        console.error('Error creating organization:', error);
        toast({
          title: "Error creating organization",
          description: "Failed to create organization. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      console.log('Organization created successfully:', organization);
      toast({
        title: "Organization created!",
        description: "Your organization has been successfully created.",
      });
      return organization;
    } catch (error) {
      console.error('Error in createOrganization:', error);
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
      console.log('joinOrganization started with:', { organizationId, userData });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user');
      }

      console.log('Current user:', user.id);

      // Check if executive role is already taken
      console.log('Checking if executive role is already taken...');
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_organizations')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('executive_role', userData.executiveRole.trim())
        .maybeSingle();

      if (roleCheckError) {
        console.error('Error checking existing role:', roleCheckError);
        throw roleCheckError;
      }

      if (existingRole) {
        console.log('Role already exists:', existingRole);
        toast({
          title: "Role already assigned",
          description: "This executive role is already assigned in your organization.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Role is available, updating profile...');
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: userData.fullName,
          onboarding_completed: true,
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      console.log('Profile updated, creating user-organization relationship...');
      // Create user-organization relationship
      const { error: orgError } = await supabase
        .from('user_organizations')
        .insert({
          user_id: user.id,
          organization_id: organizationId,
          executive_role: userData.executiveRole,
        });

      if (orgError) {
        console.error('Error creating user-organization relationship:', orgError);
        throw orgError;
      }

      console.log('User-organization relationship created successfully');

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
