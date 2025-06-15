
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';
import { EXECUTIVE_ROLES, type ExecutiveRole } from '@/lib/validationSchemas';

interface UserInfoFormProps {
  organizationId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const UserInfoForm = ({ organizationId, onComplete, onBack }: UserInfoFormProps) => {
  const [formData, setFormData] = useState<{
    fullName: string;
    executiveRole: ExecutiveRole | '';
  }>({
    fullName: '',
    executiveRole: ''
  });
  const [error, setError] = useState('');
  const { loading, joinOrganization } = useOnboarding();
  const { validateUserInfo } = useOnboardingValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Ensure executiveRole is properly typed before validation
    if (!formData.executiveRole) {
      setError('Please select an executive role');
      return;
    }

    const userInfoData = {
      fullName: formData.fullName,
      executiveRole: formData.executiveRole as ExecutiveRole
    };

    if (!validateUserInfo(userInfoData)) {
      return;
    }

    const success = await joinOrganization(organizationId, userInfoData);
    if (success) {
      onComplete();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      executiveRole: value as ExecutiveRole
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="mt-1"
            required
            maxLength={50}
          />
        </div>

        <div>
          <Label htmlFor="executiveRole">Executive Role *</Label>
          <Select value={formData.executiveRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {EXECUTIVE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Choose your executive role within the organization
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.fullName.trim() || !formData.executiveRole}
          className="w-full"
        >
          {loading ? 'Completing Setup...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
};
