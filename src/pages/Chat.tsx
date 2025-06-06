
import { useState } from 'react';
import { Send, MessageSquare, Bot, User, Loader } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your C-Suite Agent. I can help you with business queries, analyze metrics, and provide insights from your data. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Mock AI response - in real app this would call Google Gemini
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('delivery') || lowerQuery.includes('q2')) {
      return 'Based on the Q2 delivery data, I found 3 key issues:\n\n• North Region: 2 warehouse delays affecting 15% of shipments\n• East Region: 1 logistics bottleneck causing 3-day average delays\n• West Region: Supplier issue resolved, delivery times normalized\n\nRecommendation: Focus on North Region warehouse optimization and East Region logistics review.';
    }
    
    if (lowerQuery.includes('revenue') || lowerQuery.includes('finance')) {
      return 'Revenue Analysis Summary:\n\n• Q2 Revenue: $2.4M (8% increase YoY)\n• Finance Variance: +$120K above target\n• Top Performing: Sales Department (+15%)\n• Needs Attention: Ops Department (-3%)\n\nNext steps: Schedule finance review meeting with department heads.';
    }
    
    if (lowerQuery.includes('meeting') || lowerQuery.includes('schedule')) {
      return 'Your upcoming meetings:\n\n• Today 2:30 PM: Finance Review (CEO, CFO)\n• Tomorrow 10:00 AM: Sales Pipeline (Sales Team)\n• Friday 3:00 PM: Quarterly Planning (All Heads)\n\nWould you like me to schedule additional meetings or modify existing ones?';
    }
    
    return 'I understand you\'re asking about business operations. Based on the available data from Departments, Metrics, and DeliveryIssues tables, I can provide insights on revenue performance, delivery optimization, departmental metrics, and scheduling. Could you please be more specific about what aspect you\'d like me to analyze?';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Chat Assistant</h1>
            <p className="text-sm text-gray-600">Ask questions about your business data and metrics</p>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-gray-600">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input form */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                id="message"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Ask about Q2 delivery issues by region, revenue metrics, or schedule meetings..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
};

export default Chat;
