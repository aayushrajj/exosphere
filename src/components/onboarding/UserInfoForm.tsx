
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
  const [formData, setFormData] = useState({
    fullName: '',
    executiveRole: '' as ExecutiveRole | ''
  });
  const { loading, joinOrganization } = useOnboarding();
  const { validateUserInfo } = useOnboardingValidation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: ExecutiveRole) => {
    setFormData({
      ...formData,
      executiveRole: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.executiveRole) {
      return;
    }

    const userData = {
      fullName: formData.fullName.trim(),
      executiveRole: formData.executiveRole
    };

    if (!validateUserInfo(userData)) {
      return;
    }

    if (!organizationId) {
      return;
    }

    try {
      const success = await joinOrganization(organizationId, userData);
      if (success) {
        onComplete();
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
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
          <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
          <p className="text-gray-600">Complete your profile</p>
        </div>
      </div>

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
            Select the role that best describes your position in the organization
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
