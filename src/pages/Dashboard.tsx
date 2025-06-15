import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileText, 
  Menu, 
  X,
  TrendingUp,
  Clock,
  Users,
  Info,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  // Mock summary data
  const [summaryData] = useState({
    openQueries: 0,
    nextMeeting: 'Today at 2:30 PM',
    unsentDrafts: 0,
    totalMetrics: 12
  });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.full_name) {
            // Extract first name from full name
            const firstName = profile.full_name.split(' ')[0];
            setUserName(firstName);
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const navigationItems = [
    { name: 'Dashboard', icon: TrendingUp, path: '/dashboard', current: true },
    { name: 'Chat', icon: MessageSquare, path: '/chat', current: false },
    { name: 'Scheduler', icon: Calendar, path: '/scheduler', current: false },
    { name: 'Emails', icon: Mail, path: '/emails', current: false },
    { name: 'Audit', icon: FileText, path: '/audit', current: false },
    { name: 'About', icon: Info, path: '/about', current: false },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const SummaryCard = ({ title, value, icon: Icon, color = "blue" }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

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
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Welcome back, {userName}!</p>
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

        {/* Dashboard content */}
        <div className="px-4 py-6 sm:px-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <SummaryCard
              title="Open Chat Queries"
              value={summaryData.openQueries}
              icon={MessageSquare}
              color="blue"
            />
            <SummaryCard
              title="Next Meeting"
              value={summaryData.nextMeeting}
              icon={Clock}
              color="green"
            />
            <SummaryCard
              title="Unsent Email Drafts"
              value={summaryData.unsentDrafts}
              icon={Mail}
              color="yellow"
            />
            <SummaryCard
              title="Total Metrics"
              value={summaryData.totalMetrics}
              icon={TrendingUp}
              color="purple"
            />
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chat Session
              </button>
              <button
                onClick={() => navigate('/scheduler')}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Meeting
              </button>
              <button
                onClick={() => navigate('/emails')}
                className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Compose Email
              </button>
              <button
                onClick={() => navigate('/audit')}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                View Audit Log
              </button>
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No recent activity to display</p>
              <p className="text-xs text-gray-500">Your business interactions will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
