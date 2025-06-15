
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileText, 
  Menu, 
  X,
  TrendingUp,
  Info,
  Settings,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Executive {
  id: string;
  full_name: string;
  executive_role: string;
  created_at: string;
}

interface OrganizationData {
  name: string;
  executives: Executive[];
}

const YourOrganisation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);

  const navigationItems = [
    { name: 'Dashboard', icon: TrendingUp, path: '/dashboard', current: false },
    { name: 'Chat', icon: MessageSquare, path: '/chat', current: false },
    { name: 'Scheduler', icon: Calendar, path: '/scheduler', current: false },
    { name: 'Emails', icon: Mail, path: '/emails', current: false },
    { name: 'Audit', icon: FileText, path: '/audit', current: false },
    { name: 'Your Organisation', icon: Building2, path: '/your-organisation', current: true },
    { name: 'About', icon: Info, path: '/about', current: false },
  ];

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.full_name) {
            const firstName = profile.full_name.split(' ')[0];
            setUserName(firstName);
          }

          // Get user's organization
          const { data: userOrg } = await supabase
            .from('user_organizations')
            .select(`
              organization_id,
              organizations!user_organizations_organization_id_fkey(name)
            `)
            .eq('user_id', user.id)
            .single();

          if (userOrg) {
            const orgName = userOrg.organizations.name;

            // Get all executives in the organization
            const { data: executives } = await supabase
              .from('user_organizations')
              .select(`
                user_id,
                executive_role,
                created_at
              `)
              .eq('organization_id', userOrg.organization_id)
              .order('created_at', { ascending: true });

            if (executives) {
              // Fetch profiles separately for each executive
              const executivesWithProfiles = await Promise.all(
                executives.map(async (exec) => {
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', exec.user_id)
                    .single();

                  return {
                    id: exec.user_id,
                    full_name: profile?.full_name || 'Unknown',
                    executive_role: exec.executive_role,
                    created_at: exec.created_at
                  };
                })
              );

              setOrganizationData({
                name: orgName,
                executives: executivesWithProfiles
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 flex flex-col flex-shrink-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Exosphere</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-grow overflow-y-auto py-6 px-3">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg transition-colors ${
                item.current
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="w-full p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={() => navigate('/user-profile')}
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
            <Settings className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Organisation</h2>
              <p className="text-sm text-gray-600">Manage your organization and team</p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Organization content */}
        <div className="px-4 py-6 sm:px-6">
          {organizationData ? (
            <>
              {/* Organization header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Welcome to your organisation - {organizationData.name}
                </h3>
                <p className="text-gray-700 mb-2">
                  Total executives from your org on Exosphere - {organizationData.executives.length}
                </p>
                <p className="text-gray-600">
                  Below are the executives of your organisation present on Exosphere:
                </p>
              </div>

              {/* Executives table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Organization Executives</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Role in Organisation</TableHead>
                      <TableHead>Added Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationData.executives.map((executive) => (
                      <TableRow key={executive.id}>
                        <TableCell className="font-medium">{executive.full_name}</TableCell>
                        <TableCell>{executive.executive_role}</TableCell>
                        <TableCell>{formatDate(executive.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Organization Found</h3>
              <p className="text-gray-600">You are not currently part of any organization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourOrganisation;
