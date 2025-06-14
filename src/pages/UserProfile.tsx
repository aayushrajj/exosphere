import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Building2, User, Calendar, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserOrganizationData {
  full_name: string;
  executive_role: string;
  organization: {
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

        // Then get the user organization data
        console.log('Fetching user organization data...');
        const { data: userOrgData, error: userOrgError } = await supabase
          .from('user_organizations')
          .select(`
            executive_role,
            organizations!inner(name, org_code, domain, founding_year, description)
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

        if (userOrgData && profile) {
          const formattedData: UserOrganizationData = {
            full_name: profile.full_name || '',
            executive_role: userOrgData.executive_role,
            organization: {
              name: userOrgData.organizations.name,
              org_code: userOrgData.organizations.org_code,
              domain: userOrgData.organizations.domain,
              founding_year: userOrgData.organizations.founding_year,
              description: userOrgData.organizations.description
            }
          };
          console.log('Setting formatted user data:', formattedData);
          setUserData(formattedData);
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

  const copyOrgCode = () => {
    if (userData?.organization.org_code) {
      navigator.clipboard.writeText(userData.organization.org_code);
      toast({
        title: "Copied!",
        description: "Organization code copied to clipboard",
      });
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">User & Organization Profile</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg font-semibold text-gray-900">{userData.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Executive Role</label>
                <p className="text-lg font-semibold text-gray-900">{userData.executive_role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Name</label>
                <p className="text-lg font-semibold text-gray-900">{userData.organization.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Code</label>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono">
                    {userData.organization.org_code}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyOrgCode}
                    className="flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Share this code with others to invite them to your organization
                </p>
              </div>

              {userData.organization.domain && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Domain</label>
                  <p className="text-lg text-gray-900 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {userData.organization.domain}
                  </p>
                </div>
              )}

              {userData.organization.founding_year && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Founded</label>
                  <p className="text-lg text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {userData.organization.founding_year}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Organization Description */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About the Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{userData.organization.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
