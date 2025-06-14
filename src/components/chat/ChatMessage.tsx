
import { Bot, User } from 'lucide-react';
import { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
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
  );
};
