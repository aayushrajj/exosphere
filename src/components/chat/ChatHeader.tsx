
import { MessageSquare, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onRefreshSession: () => void;
}

export const ChatHeader = ({ onRefreshSession }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="mr-3 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Chat Assistant</h1>
            <p className="text-sm text-gray-600">Ask questions about your business data and metrics</p>
          </div>
        </div>
        <Button
          onClick={onRefreshSession}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Session
        </Button>
      </div>
    </div>
  );
};
