
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
  User,
  Download,
  ExternalLink,
  Settings,
  ArrowLeft,
  Building2
} from 'lucide-react';

const AboutMaker = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState('Ayush');

  const navigationItems = [
    { name: 'Dashboard', icon: TrendingUp, path: '/dashboard', current: false },
    { name: 'Chat', icon: MessageSquare, path: '/chat', current: false },
    { name: 'Scheduler', icon: Calendar, path: '/scheduler', current: false },
    { name: 'Emails', icon: Mail, path: '/emails', current: false },
    { name: 'Audit', icon: FileText, path: '/audit', current: false },
    { name: 'Your Organisation', icon: Building2, path: '/your-organisation', current: false },
    { name: 'About', icon: Info, path: '/about', current: false },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

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
              <span className="text-white text-sm font-medium">A</span>
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
            <div className="flex items-center">
              <button
                onClick={() => navigate('/about')}
                className="flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Developer Profile</h2>
                <p className="text-sm text-gray-600">Ayush Raj</p>
              </div>
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

        {/* Developer Profile content */}
        <div className="px-4 py-6 sm:px-6 space-y-6">
          {/* Bio section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bio</h3>
            <p className="text-gray-700 leading-relaxed">
              Ayush Raj holds a Master's in Mathematics & Computing from BIT Mesra and currently works as a Research & Innovation Engineer building GenAI pipelines, automations, and full-stack solutions. His key strengths include developing RAG-based data extraction, end-to-end UiPath automations, and scalable AI-driven applications. He is passionate about bridging data science with production-grade systems and constantly learning new AI/ML techniques.
            </p>
          </div>

          {/* Contact & Links section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact & Links</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:ayushraj.work.dev@gmail.com" className="text-blue-600 hover:text-blue-700">
                  ayushraj.work.dev@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="h-4 w-4 mr-2 text-center">📞</span>
                <span>+91 73729 32123</span>
              </div>
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                <a 
                  href="http://www.linkedin.com/in/ayush-raj-0309" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                <a 
                  href="https://github.com/aayushrajj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>

          {/* Resume viewer section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">View Full Resume</h3>
            
            {/* Resume embed area */}
            <div className="mb-4">
              <iframe 
                src="/resume.pdf" 
                className="w-full h-96 md:h-[600px] border border-gray-300 rounded-lg"
                title="Resume PDF"
              ></iframe>
            </div>

            {/* Download link */}
            <div className="flex justify-center">
              <a 
                href="/resume.pdf" 
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume ›
              </a>
            </div>
          </div>

          {/* Footer signature */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 italic text-center">Made by – Ayush Raj</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMaker;
