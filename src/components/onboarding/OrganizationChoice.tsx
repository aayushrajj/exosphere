
import { Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrganizationChoiceProps {
  onChoice: (choice: 'join' | 'create') => void;
}

export const OrganizationChoice = ({ onChoice }: OrganizationChoiceProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
        <p className="text-gray-600">Choose how you'd like to proceed</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => onChoice('join')}
          variant="outline"
          className="w-full h-auto p-6 flex flex-col items-center space-y-3 hover:bg-blue-50 hover:border-blue-300"
        >
          <Users className="h-8 w-8 text-blue-600" />
          <div className="text-center">
            <div className="font-semibold text-gray-900">Join an Existing Organization</div>
            <div className="text-sm text-gray-600">Enter an organization code to join</div>
          </div>
        </Button>

        <Button
          onClick={() => onChoice('create')}
          variant="outline"
          className="w-full h-auto p-6 flex flex-col items-center space-y-3 hover:bg-green-50 hover:border-green-300"
        >
          <Building2 className="h-8 w-8 text-green-600" />
          <div className="text-center">
            <div className="font-semibold text-gray-900">Create a New Organization</div>
            <div className="text-sm text-gray-600">Set up your organization</div>
          </div>
        </Button>
      </div>
    </div>
  );
};
