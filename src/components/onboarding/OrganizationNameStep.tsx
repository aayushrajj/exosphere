
import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';

interface OrganizationNameStepProps {
  onSuccess: (organizationName: string) => void;
  onBack: () => void;
}

export const OrganizationNameStep = ({ onSuccess, onBack }: OrganizationNameStepProps) => {
  const [orgName, setOrgName] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [validatedName, setValidatedName] = useState('');
  const { loading, validateOrganizationName } = useOnboardingValidation();

  const handleValidate = async () => {
    if (!orgName.trim()) return;
    
    const isValid = await validateOrganizationName(orgName);
    if (isValid) {
      setIsValidated(true);
      setValidatedName(orgName);
    }
  };

  const handleContinue = () => {
    if (isValidated && validatedName) {
      onSuccess(validatedName);
    }
  };

  const handleNameChange = (value: string) => {
    setOrgName(value);
    if (isValidated) {
      setIsValidated(false);
      setValidatedName('');
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
          <h2 className="text-2xl font-bold text-gray-900">Organization Name</h2>
          <p className="text-gray-600">Enter your organization name to get started</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="orgName">Organization Name *</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter organization name"
              className={isValidated ? 'border-green-500' : ''}
              disabled={loading}
            />
            <Button
              onClick={handleValidate}
              disabled={!orgName.trim() || loading || isValidated}
              variant={isValidated ? "outline" : "default"}
            >
              {loading ? 'Validating...' : isValidated ? <CheckCircle className="h-4 w-4" /> : 'Validate'}
            </Button>
          </div>
          {isValidated && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Organization name is available
            </p>
          )}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isValidated}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
