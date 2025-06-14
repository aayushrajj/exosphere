
import { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOnboarding } from '@/hooks/useOnboarding';

interface CreateOrganizationProps {
  onSuccess: (organizationId: string) => void;
  onBack: () => void;
}

export const CreateOrganization = ({ onSuccess, onBack }: CreateOrganizationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    founding_year: '',
    domain: '',
    description: ''
  });
  const [createdOrg, setCreatedOrg] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { loading, createOrganization } = useOnboarding();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }

    const orgData = {
      name: formData.name.trim(),
      founding_year: formData.founding_year ? parseInt(formData.founding_year) : undefined,
      domain: formData.domain.trim() || undefined,
      description: formData.description.trim()
    };

    const organization = await createOrganization(orgData);
    if (organization) {
      setCreatedOrg(organization);
    }
  };

  const copyOrgCode = async () => {
    if (createdOrg?.org_code) {
      await navigator.clipboard.writeText(createdOrg.org_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    if (createdOrg) {
      onSuccess(createdOrg.id);
    }
  };

  if (createdOrg) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Created!</h2>
          <p className="text-gray-600">Your organization has been successfully created.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <Label className="text-sm font-medium text-gray-700">Organization Code</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              value={createdOrg.org_code}
              readOnly
              className="font-mono text-center"
            />
            <Button
              onClick={copyOrgCode}
              variant="outline"
              size="sm"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Share this code with others to invite them to your organization
          </p>
        </div>

        <Button onClick={handleContinue} className="w-full">
          Continue Setup
        </Button>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Create Organization</h2>
          <p className="text-gray-600">Set up your organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Organization Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter organization name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="founding_year">Founding Year</Label>
          <Input
            id="founding_year"
            name="founding_year"
            type="number"
            value={formData.founding_year}
            onChange={handleInputChange}
            placeholder="e.g. 2020"
            className="mt-1"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            name="domain"
            type="text"
            value={formData.domain}
            onChange={handleInputChange}
            placeholder="e.g. Technology, Healthcare"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Short Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of your organization"
            className="mt-1"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.name.trim() || !formData.description.trim()}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </div>
  );
};
