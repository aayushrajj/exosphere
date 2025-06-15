
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';

interface JoinOrganizationProps {
  onSuccess: (organizationId: string) => void;
  onBack: () => void;
}

export const JoinOrganization = ({ onSuccess, onBack }: JoinOrganizationProps) => {
  const [orgCode, setOrgCode] = useState('');
  const [error, setError] = useState('');
  const { loading, validateOrgCode } = useOnboarding();
  const { validateOrgCode: validateCodeFormat, validateOrganizationMemberLimit } = useOnboardingValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Join organization form submitted with code:', orgCode);

    if (!validateCodeFormat(orgCode)) {
      return;
    }

    console.log('Code format validation passed, checking organization...');

    try {
      const organization = await validateOrgCode(orgCode);
      if (organization) {
        console.log('Organization found:', organization);
        
        // Check member limit before allowing join
        const canJoin = await validateOrganizationMemberLimit(organization.id);
        if (canJoin) {
          console.log('Member limit check passed, calling onSuccess');
          onSuccess(organization.id);
        }
      } else {
        console.log('Organization not found for code:', orgCode);
        setError('Invalid organization code');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Failed to validate organization code. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 h-10 w-10 flex items-center justify-center"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Join Organization</h2>
          <p className="text-gray-600">Enter your organization code</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="orgCode" className="text-sm font-medium">
            Organization Code
          </Label>
          <Input
            id="orgCode"
            type="text"
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value)}
            placeholder="Enter organization code"
            className="h-12"
            maxLength={20}
          />
          <p className="text-xs text-gray-500">
            Ask your organization administrator for the code
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !orgCode.trim()}
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Validating...' : 'Continue'}
        </Button>
      </form>
    </div>
  );
};
