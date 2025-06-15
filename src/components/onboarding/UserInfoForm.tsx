
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';
import { EXECUTIVE_ROLES } from '@/lib/validationSchemas';
import type { UserInfoData } from '@/lib/validationSchemas';

interface UserInfoFormProps {
  organizationId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const UserInfoForm = ({ organizationId, onComplete, onBack }: UserInfoFormProps) => {
  const [formData, setFormData] = useState<UserInfoData>({
    fullName: '',
    executiveRole: 'Guest'
  });
  const [error, setError] = useState('');
  const { loading, joinOrganization } = useOnboarding();
  const { validateUserInfo } = useOnboardingValidation();

  const handleInputChange = (field: keyof UserInfoData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submit triggered with data:', formData);

    if (!validateUserInfo(formData)) {
      return;
    }

    console.log('Validation passed, attempting to join organization...');

    try {
      // Ensure we have the required fields before calling joinOrganization
      const userData = {
        fullName: formData.fullName.trim(),
        executiveRole: formData.executiveRole
      };
      
      const success = await joinOrganization(organizationId, userData);
      if (success) {
        console.log('Successfully joined organization, calling onComplete');
        onComplete();
      } else {
        setError('Failed to complete onboarding. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const isFormValid = formData.fullName.trim().length > 0 && formData.executiveRole;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 touch-target"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
          <p className="text-gray-600">Complete your profile</p>
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
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
            maxLength={50}
            required
          />
        </div>

        <div>
          <Label htmlFor="executiveRole">Executive Role *</Label>
          <Select
            value={formData.executiveRole}
            onValueChange={(value) => handleInputChange('executiveRole', value)}
          >
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
        </div>

        <Button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full h-12 text-base font-medium touch-target"
        >
          {loading ? 'Completing Setup...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
};
