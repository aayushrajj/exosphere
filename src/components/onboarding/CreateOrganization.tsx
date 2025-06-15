
import { useState } from 'react';
import { OrganizationNameStep } from './OrganizationNameStep';
import { CreateOrganizationForm } from './CreateOrganizationForm';

interface CreateOrganizationProps {
  onSuccess: (organizationId: string) => void;
  onBack: () => void;
}

export const CreateOrganization = ({ onSuccess, onBack }: CreateOrganizationProps) => {
  const [currentStep, setCurrentStep] = useState<'name' | 'details'>('name');
  const [organizationName, setOrganizationName] = useState('');

  const handleNameValidated = (name: string) => {
    setOrganizationName(name);
    setCurrentStep('details');
  };

  const handleBackToName = () => {
    setCurrentStep('name');
  };

  if (currentStep === 'name') {
    return (
      <OrganizationNameStep
        onSuccess={handleNameValidated}
        onBack={onBack}
      />
    );
  }

  return (
    <CreateOrganizationForm
      organizationName={organizationName}
      onSuccess={onSuccess}
      onBack={handleBackToName}
    />
  );
};
