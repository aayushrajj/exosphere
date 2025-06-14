import { useState } from 'react';
import { FileText, MessageSquare, Calendar, Mail, Filter, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuditLogEntry {
  id: string;
  actionType: 'Chat' | 'Meeting' | 'Email';
  description: string;
  timestamp: string;
  details?: any;
}

const Audit = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'All' | 'Chat' | 'Meeting' | 'Email'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock audit log data
  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      actionType: 'Chat',
      description: 'Query: "Show me Q2 delivery issues by region" - AI provided analysis of 3 regional delivery issues',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: { query: 'Show me Q2 delivery issues by region', responseLength: 245 }
    },
    {
      id: '2',
      actionType: 'Meeting',
      description: 'Scheduled: Finance Review meeting with CEO, CFO for today at 2:30 PM',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: { title: 'Finance Review', attendees: ['CEO', 'CFO'], time: '14:30' }
    },
    {
      id: '3',
      actionType: 'Email',
      description: 'Sent: Revenue Variance analysis request to Finance department',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      details: { department: 'Finance', metric: 'Revenue Variance', length: 420 }
    },
    {
      id: '4',
      actionType: 'Chat',
      description: 'Query: "Revenue analysis summary" - AI provided Q2 revenue breakdown and recommendations',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      details: { query: 'Revenue analysis summary', responseLength: 310 }
    },
    {
      id: '5',
      actionType: 'Meeting',
      description: 'Scheduled: Sales Pipeline Review with CEO, Sales team for tomorrow at 10:00 AM',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      details: { title: 'Sales Pipeline Review', attendees: ['CEO', 'Sales'], time: '10:00' }
    },
    {
      id: '6',
      actionType: 'Email',
      description: 'Sent: Delivery Performance metrics review request to Delivery department',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      details: { department: 'Delivery', metric: 'Delivery Turnaround', length: 380 }
    }
  ]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filterType === 'All' || log.actionType === filterType;
    const matchesSearch = searchTerm === '' || 
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'Chat':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'Meeting':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'Email':
        return <Mail className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'Chat':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Meeting':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Email':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const actionTypeCounts = {
    All: auditLogs.length,
    Chat: auditLogs.filter(log => log.actionType === 'Chat').length,
    Meeting: auditLogs.filter(log => log.actionType === 'Meeting').length,
    Email: auditLogs.filter(log => log.actionType === 'Email').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-600 mt-1">Track all system actions and executive activities</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(actionTypeCounts).map(([type, count]) => (
            <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100">
                  {getActionIcon(type === 'All' ? 'FileText' : type)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{type} Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter buttons */}
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-400 self-center" />
              {(['All', 'Chat', 'Meeting', 'Email'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type} ({actionTypeCounts[type]})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search audit logs..."
              />
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No activities found</p>
              <p className="text-xs text-gray-500">
                {searchTerm ? 'Try adjusting your search or filters' : 'Your activities will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Action Icon */}
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg border ${getActionColor(log.actionType)}`}>
                        {getActionIcon(log.actionType)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.actionType)}`}>
                            {log.actionType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-900 leading-relaxed">
                        {log.description}
                      </p>

                      {/* Additional details */}
                      {log.details && (
                        <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                          {log.actionType === 'Chat' && (
                            <div>
                              <span className="font-medium">Query:</span> "{log.details.query}" • 
                              <span className="font-medium"> Response:</span> {log.details.responseLength} characters
                            </div>
                          )}
                          {log.actionType === 'Meeting' && (
                            <div>
                              <span className="font-medium">Title:</span> {log.details.title} • 
                              <span className="font-medium"> Attendees:</span> {log.details.attendees.join(', ')} • 
                              <span className="font-medium"> Time:</span> {log.details.time}
                            </div>
                          )}
                          {log.actionType === 'Email' && (
                            <div>
                              <span className="font-medium">Department:</span> {log.details.department} • 
                              <span className="font-medium"> Metric:</span> {log.details.metric} • 
                              <span className="font-medium"> Length:</span> {log.details.length} characters
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
