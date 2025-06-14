
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  sessionId: string;
}

export const ChatInput = ({ inputValue, setInputValue, onSubmit, isLoading, sessionId }: ChatInputProps) => {
  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
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
                  onSubmit(e);
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
          Press Enter to send, Shift+Enter for new line • Session ID: {sessionId.split('_')[1]}
        </p>
      </form>
    </div>
  );
};
