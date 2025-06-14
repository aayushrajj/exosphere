
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Building2, User, Calendar, Globe, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationChanges } from '@/hooks/useOrganizationChanges';

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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOrgPassword, setDeleteOrgPassword] = useState('');
  const [deleteUserPassword, setDeleteUserPassword] = useState('');
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

        // Then get the user organization data
        console.log('Fetching user organization data...');
        const { data: userOrgData, error: userOrgError } = await supabase
          .from('user_organizations')
          .select(`
            executive_role,
            organizations!inner(id, name, org_code, domain, founding_year, description)
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

  const copyOrgCode = () => {
    if (userData?.organization.org_code) {
      navigator.clipboard.writeText(userData.organization.org_code);
      toast({
        title: "Copied!",
        description: "Organization code copied to clipboard",
      });
    }
  };

  const verifyPasswordAndDeleteOrganization = async () => {
    if (!userData?.organization.id || !deleteOrgPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }
    
    setDeleteLoading(true);
    try {
      // First verify the password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast({
          title: "Error",
          description: "Unable to verify user credentials.",
          variant: "destructive",
        });
        setDeleteLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deleteOrgPassword
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setDeleteOrgPassword('');
        setDeleteLoading(false);
        return;
      }

      // If password is correct, proceed with deletion
      const { error } = await supabase.rpc('delete_organization', {
        org_id: userData.organization.id
      });

      if (error) {
        console.error('Delete organization error:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Organization Deleted",
          description: "The organization and all its data have been permanently deleted.",
        });
        
        // Sign out the user after deleting organization
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected delete organization error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the organization.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteOrgPassword('');
    }
  };

  const verifyPasswordAndDeleteUser = async () => {
    if (!deleteUserPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Unable to verify user credentials.",
        variant: "destructive",
      });
      return;
    }

    setDeleteLoading(true);
    try {
      // First verify the password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deleteUserPassword
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setDeleteUserPassword('');
        setDeleteLoading(false);
        return;
      }

      // If password is correct, proceed with deletion
      const { error } = await supabase.rpc('delete_user_data', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Delete user error:', error);
        toast({
          title: "Error",
          description: "Failed to delete user data. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Data Deleted",
          description: "Your user data has been permanently deleted.",
        });
        
        // Sign out the user after deleting their data
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected delete user error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting user data.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteUserPassword('');
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

  const getUserDeletionConsequences = () => {
    if (!userData) return null;

    const isCEO = userData.executive_role === 'CEO';
    const isLastUser = organizationUserCount === 1;
    const hasOtherUsers = organizationUserCount > 1;

    if (isLastUser) {
      return {
        title: "Delete Account & Organization",
        description: "You are the only member of this organization. Deleting your account will also permanently delete the entire organization.",
        consequences: [
          "Your account and profile will be deleted",
          "The entire organization will be deleted",
          "All organization data will be permanently lost",
          "This action cannot be undone"
        ],
        icon: AlertTriangle,
        buttonText: "Delete Account & Organization"
      };
    } else if (isCEO && hasOtherUsers) {
      return {
        title: "Delete Account & Transfer CEO Role",
        description: "You are the CEO with other team members. Deleting your account will automatically promote another member to CEO.",
        consequences: [
          "Your account and profile will be deleted",
          "CEO role will be transferred to the next senior member",
          "The organization will continue with the new CEO",
          "This action cannot be undone"
        ],
        icon: User,
        buttonText: "Delete Account & Transfer CEO"
      };
    } else {
      return {
        title: "Delete Account",
        description: "Deleting your account will remove you from the organization.",
        consequences: [
          "Your account and profile will be deleted",
          "You will be removed from the organization",
          "The organization will continue without you",
          "This action cannot be undone"
        ],
        icon: User,
        buttonText: "Delete My Account"
      };
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
  const deletionInfo = getUserDeletionConsequences();

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
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Members</label>
                <p className="text-lg text-gray-900">{organizationUserCount} {organizationUserCount === 1 ? 'member' : 'members'}</p>
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

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Delete Organization Button - Only for CEO */}
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Delete Organization</h4>
                <p className="text-sm text-gray-600">
                  Permanently delete this organization and all associated data. This action cannot be undone.
                  {!isCEO && " (Only available to CEO)"}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!isCEO || deleteLoading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Organization
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the organization "{userData.organization.name}" and all associated data including:
                      <ul className="list-disc ml-6 mt-2 mb-4">
                        <li>All user accounts in this organization</li>
                        <li>All chat logs and data</li>
                        <li>Organization settings and information</li>
                      </ul>
                      <strong>This action cannot be undone.</strong>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter your password to confirm:
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={deleteOrgPassword}
                          onChange={(e) => setDeleteOrgPassword(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteOrgPassword('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={verifyPasswordAndDeleteOrganization}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteLoading || !deleteOrgPassword.trim()}
                    >
                      {deleteLoading ? "Deleting..." : "Yes, Delete Organization"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Delete User Button with Enhanced Confirmation */}
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Delete Your Account</h4>
                <p className="text-sm text-gray-600">
                  Permanently delete your user account and all associated data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteLoading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                      {deletionInfo && <deletionInfo.icon className="h-5 w-5 mr-2" />}
                      {deletionInfo?.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {deletionInfo?.description}
                      <div className="mt-4 mb-4">
                        <strong>What will happen:</strong>
                        <ul className="list-disc ml-6 mt-2">
                          {deletionInfo?.consequences.map((consequence, index) => (
                            <li key={index}>{consequence}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter your password to confirm:
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={deleteUserPassword}
                          onChange={(e) => setDeleteUserPassword(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteUserPassword('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={verifyPasswordAndDeleteUser}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteLoading || !deleteUserPassword.trim()}
                    >
                      {deleteLoading ? "Deleting..." : deletionInfo?.buttonText}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
