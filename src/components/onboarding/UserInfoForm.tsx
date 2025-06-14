
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/hooks/useOnboarding';

interface UserInfoFormProps {
  organizationId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const UserInfoForm = ({ organizationId, onComplete, onBack }: UserInfoFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    executiveRole: ''
  });
  const [error, setError] = useState('');
  const { loading, joinOrganization } = useOnboarding();

  console.log('UserInfoForm rendered with organizationId:', organizationId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted with data:', formData);
    console.log('Organization ID:', organizationId);

    if (!formData.fullName.trim() || !formData.executiveRole.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!organizationId) {
      setError('Organization ID is missing');
      return;
    }

    try {
      console.log('Calling joinOrganization...');
      const success = await joinOrganization(organizationId, {
        fullName: formData.fullName.trim(),
        executiveRole: formData.executiveRole.trim()
      });

      console.log('joinOrganization result:', success);

      if (success) {
        console.log('Success! Calling onComplete...');
        onComplete();
      } else {
        console.log('joinOrganization returned false');
        setError('Failed to complete setup. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('An unexpected error occurred. Please try again.');
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
          />
        </div>

        <div>
          <Label htmlFor="executiveRole">Executive Role *</Label>
          <Input
            id="executiveRole"
            name="executiveRole"
            type="text"
            value={formData.executiveRole}
            onChange={handleInputChange}
            placeholder="e.g. CEO, CTO, CFO"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This role must be unique within your organization
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.fullName.trim() || !formData.executiveRole.trim()}
          className="w-full"
        >
          {loading ? 'Completing Setup...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
};
