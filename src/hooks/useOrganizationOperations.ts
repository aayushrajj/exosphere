
import { useState } from 'react';
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

export const useOrganizationOperations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createOrganization = async (orgData: {
    name: string;
    founding_year?: number;
    description: string;
  }): Promise<Organization | null> => {
    setLoading(true);
    
    try {
      console.log('Creating organization with data:', orgData);

      if (!orgData.name.trim()) {
        toast({
          title: "Invalid organization name",
          description: "Organization name cannot be empty.",
          variant: "destructive",
        });
        return null;
      }

      const { data: organization, error } = await supabase
        .from('organizations')
        .insert([{
          name: orgData.name.trim(),
          founding_year: orgData.founding_year,
          description: orgData.description.trim()
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating organization:', error);
        toast({
          title: "Error creating organization",
          description: error.message || "Failed to create organization. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (!organization) {
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
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found:', userError);
        toast({
          title: "Authentication error",
          description: "Please log in again.",
          variant: "destructive",
        });
        return false;
      }

      if (!userData.fullName.trim() || !userData.executiveRole.trim()) {
        toast({
          title: "Invalid data",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Current user:', user.id);

      // Check if executive role is already taken (except for Guest role)
      if (userData.executiveRole !== 'Guest') {
        const { data: existingRole, error: roleCheckError } = await supabase
          .from('user_organizations')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('executive_role', userData.executiveRole.trim())
          .maybeSingle();

        if (roleCheckError) {
          console.error('Error checking existing role:', roleCheckError);
          toast({
            title: "Error checking role availability",
            description: roleCheckError.message || "Please try again.",
            variant: "destructive",
          });
          return false;
        }

        if (existingRole) {
          console.log('Role already exists:', existingRole);
          toast({
            title: "Role already assigned",
            description: "This executive role is already assigned in your organization. Please choose a different role.",
            variant: "destructive",
          });
          return false;
        }
      }

      console.log('Role is available, updating profile...');
      
      // Update profile with upsert for safety
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: userData.fullName.trim(),
          onboarding_completed: true,
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Error updating profile",
          description: profileError.message || "Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Profile updated, creating user-organization relationship...');
      
      // Create user-organization relationship
      const { error: orgError } = await supabase
        .from('user_organizations')
        .insert({
          user_id: user.id,
          organization_id: organizationId,
          executive_role: userData.executiveRole.trim(),
        });

      if (orgError) {
        console.error('Error creating user-organization relationship:', orgError);
        toast({
          title: "Error joining organization",
          description: orgError.message || "Please try again.",
          variant: "destructive",
        });
        return false;
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

  return {
    loading,
    createOrganization,
    joinOrganization,
  };
};
