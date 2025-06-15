import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationChanges } from '@/hooks/useOrganizationChanges';
import UserInfoCard from '@/components/profile/UserInfoCard';
import OrganizationInfoCard from '@/components/profile/OrganizationInfoCard';
import OrganizationAboutCard from '@/components/profile/OrganizationAboutCard';
import PasswordUpdateCard from '@/components/profile/PasswordUpdateCard';
import DangerZoneCard from '@/components/profile/DangerZoneCard';

interface UserOrganizationData {
  full_name: string;
  executive_role: string;
  organization: {
    id: string;
    name: string;
    org_code: string;
    domain?: string;
    founding_year?: number;
    description: string;
  };
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserOrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationUserCount, setOrganizationUserCount] = useState(0);

  // Use the organization changes hook for notifications
  useOrganizationChanges(userData?.organization.id);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Starting to fetch user data...');
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);
        
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Fetching profile for user:', user.id);
        // First get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('Profile fetched:', profile);

        // Then get the user organization data with explicit foreign key reference
        console.log('Fetching user organization data...');
        const { data: userOrgData, error: userOrgError } = await supabase
          .from('user_organizations')
          .select(`
            executive_role,
            organizations!user_organizations_organization_id_fkey(id, name, org_code, domain, founding_year, description)
          `)
          .eq('user_id', user.id)
          .single();

        if (userOrgError) {
          console.error('Error fetching organization data:', userOrgError);
          toast({
            title: "Error",
            description: "Failed to load organization information",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('Organization data fetched:', userOrgData);

        if (userOrgData && profile && userOrgData.organizations) {
          const formattedData: UserOrganizationData = {
            full_name: profile.full_name || '',
            executive_role: userOrgData.executive_role,
            organization: {
              id: userOrgData.organizations.id,
              name: userOrgData.organizations.name,
              org_code: userOrgData.organizations.org_code,
              domain: userOrgData.organizations.domain,
              founding_year: userOrgData.organizations.founding_year,
              description: userOrgData.organizations.description
            }
          };
          console.log('Setting formatted user data:', formattedData);
          setUserData(formattedData);

          // Get organization user count
          const { count, error: countError } = await supabase
            .from('user_organizations')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', userOrgData.organizations.id);

          if (!countError && count !== null) {
            setOrganizationUserCount(count);
          }
        } else {
          console.log('Missing profile or organization data');
        }
      } catch (error) {
        console.error('Unexpected error in fetchUserData:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Error",
          description: "Failed to logout. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isCEO = userData.executive_role === 'CEO';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          {/* User Information and Organization Information in 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserInfoCard
              fullName={userData.full_name}
              executiveRole={userData.executive_role}
              organizationUserCount={organizationUserCount}
            />
            
            <OrganizationInfoCard organization={userData.organization} />
          </div>

          {/* About the Organization - Full width */}
          <OrganizationAboutCard description={userData.organization.description} />

          {/* Password Update Section */}
          <PasswordUpdateCard />

          {/* Danger Zone */}
          <DangerZoneCard
            isCEO={isCEO}
            organizationName={userData.organization.name}
            organizationId={userData.organization.id}
            organizationUserCount={organizationUserCount}
            executiveRole={userData.executive_role}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
