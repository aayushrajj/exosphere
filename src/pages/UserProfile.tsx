
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Copy, 
  CheckCircle, 
  ArrowLeft,
  Calendar,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';

interface UserOrganizationData {
  id: string;
  executive_role: string;
  organization: {
    id: string;
    name: string;
    founding_year?: number;
    domain?: string;
    description: string;
    org_code: string;
  };
}

interface UserProfileData {
  id: string;
  full_name?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { getUserOrganization } = useOnboarding();
  const [userOrg, setUserOrg] = useState<UserOrganizationData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // Get user organization
      const orgData = await getUserOrganization();
      setUserOrg(orgData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyOrgCode = async () => {
    if (userOrg?.organization?.org_code) {
      await navigator.clipboard.writeText(userOrg.organization.org_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User & Organization Info</h1>
              <p className="text-sm text-gray-600">Manage your profile and organization details</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <p className="text-gray-600">Your profile details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {userProfile?.full_name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Executive Role</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {userOrg?.executive_role || 'Not assigned'}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Card */}
        {userOrg?.organization && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Organization Details</h2>
                <p className="text-gray-600">Your organization information</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {userOrg.organization.name}
                  </div>
                </div>
                {userOrg.organization.founding_year && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founding Year</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {userOrg.organization.founding_year}
                    </div>
                  </div>
                )}
              </div>

              {userOrg.organization.domain && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    {userOrg.organization.domain}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {userOrg.organization.description}
                </div>
              </div>

              {/* Organization Code */}
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Code</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md font-mono text-center">
                    {userOrg.organization.org_code}
                  </div>
                  <Button
                    onClick={copyOrgCode}
                    variant="outline"
                    size="sm"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Share this code with others to invite them to your organization
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
