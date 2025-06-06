
import { useState } from 'react';
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
  User
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState('Executive User'); // Mock user name
  const navigationItems = [
    { name: 'Dashboard', icon: TrendingUp, path: '/dashboard', current: false },
    { name: 'About', icon: Info, path: '/about', current: true },
    { name: 'About the Maker', icon: User, path: '/about-maker', current: false },
    { name: 'Chat', icon: MessageSquare, path: '/chat', current: false },
    { name: 'Scheduler', icon: Calendar, path: '/scheduler', current: false },
    { name: 'Emails', icon: Mail, path: '/emails', current: false },
    { name: 'Audit', icon: FileText, path: '/audit', current: false },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}      {/* Sidebar */}
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
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">EU</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <button 
                onClick={() => navigate('/login')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>        </div>
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
              <h2 className="text-2xl font-bold text-gray-900">About Exosphere</h2>
              <p className="text-sm text-gray-600">The C-Suite Agent App</p>
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

        {/* About content */}
        <div className="px-4 py-6 sm:px-6">
          {/* Main content card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl">
            {/* Intro paragraph */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                This page provides a high-level overview of Exosphere and why it was created. It highlights the core problem Exosphere solves for executives without repeating every feature in detail.
              </p>
            </div>

            {/* Why Exosphere? section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Exosphere?</h3>
              <div className="text-gray-700 space-y-3">
                <p className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Centralizes real-time business insights from all key departments (Finance, Sales, Ops, HR, Delivery).
                </p>
                <p className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Automates meeting scheduling and follow-up tasks to free up executive bandwidth.
                </p>
                <p className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Maintains a continuous audit trail of every action for compliance and transparency.
                </p>
              </div>
            </div>

            {/* Core Benefits section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Benefits</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Instant Insights</h4>
                  <p className="text-gray-700">Executives can ask questions in natural language and receive up-to-date answers without digging through static reports.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Automated Coordination</h4>
                  <p className="text-gray-700">The agent automatically schedules meetings and drafts follow-up emails when KPIs slip.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Audit-Ready Records</h4>
                  <p className="text-gray-700">Every interaction is logged, ensuring easy compliance with standards like CMMI and ISO.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Scalable Architecture</h4>
                  <p className="text-gray-700">Built on modular agents, allowing new departments or data sources to be added seamlessly.</p>
                </div>
              </div>
            </div>

            {/* Footer signature */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic text-center">Made by – Ayush Raj</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
