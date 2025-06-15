
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

    if (!validateCodeFormat(orgCode)) {
      return;
    }

    const organization = await validateOrgCode(orgCode);
    if (organization) {
      // Check member limit before allowing join
      const canJoin = await validateOrganizationMemberLimit(organization.id);
      if (canJoin) {
        onSuccess(organization.id);
      }
    } else {
      setError('Invalid organization code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="orgCode">Organization Code</Label>
          <Input
            id="orgCode"
            type="text"
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value)}
            placeholder="Enter organization code"
            className="mt-1"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ask your organization administrator for the code
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !orgCode.trim()}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Continue'}
        </Button>
      </form>
    </div>
  );
};
