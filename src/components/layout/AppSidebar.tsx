
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileText, 
  X,
  TrendingUp,
  Info,
  Settings,
  Building2
} from 'lucide-react';

interface NavigationItem {
  name: string;
  icon: any;
  path: string;
  current: boolean;
}

interface AppSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userName: string;
  currentPath: string;
}

const AppSidebar = ({ sidebarOpen, setSidebarOpen, userName, currentPath }: AppSidebarProps) => {
  const navigate = useNavigate();

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', icon: TrendingUp, path: '/dashboard', current: currentPath === '/dashboard' },
    { name: 'Chat', icon: MessageSquare, path: '/chat', current: currentPath === '/chat' },
    { name: 'Scheduler', icon: Calendar, path: '/scheduler', current: currentPath === '/scheduler' },
    { name: 'Emails', icon: Mail, path: '/emails', current: currentPath === '/emails' },
    { name: 'Audit', icon: FileText, path: '/audit', current: currentPath === '/audit' },
    { name: 'Your Organisation', icon: Building2, path: '/your-organisation', current: currentPath === '/your-organisation' },
    { name: 'About', icon: Info, path: '/about', current: currentPath === '/about' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
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
  );
};

export default AppSidebar;
