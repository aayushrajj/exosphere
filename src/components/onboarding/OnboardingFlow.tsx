
import { useState } from 'react';
import { OrganizationChoice } from './OrganizationChoice';
import { JoinOrganization } from './JoinOrganization';
import { CreateOrganization } from './CreateOrganization';
import { UserInfoForm } from './UserInfoForm';

type OnboardingStep = 'choice' | 'join' | 'create' | 'userInfo';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('choice');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');

  const handleOrganizationChoice = (choice: 'join' | 'create') => {
    console.log('Organization choice selected:', choice);
    setCurrentStep(choice);
  };

  const handleJoinSuccess = (organizationId: string) => {
    console.log('Join success with organization ID:', organizationId);
    setSelectedOrganizationId(organizationId);
    setCurrentStep('userInfo');
  };

  const handleCreateSuccess = (organizationId: string) => {
    console.log('Create success with organization ID:', organizationId);
    setSelectedOrganizationId(organizationId);
    setCurrentStep('userInfo');
  };

  const handleUserInfoComplete = () => {
    console.log('User info complete, calling onComplete');
    onComplete();
  };

  const handleBack = () => {
    console.log('Back button pressed from step:', currentStep);
    if (currentStep === 'join' || currentStep === 'create') {
      setCurrentStep('choice');
    } else if (currentStep === 'userInfo') {
      setCurrentStep('choice');
      setSelectedOrganizationId('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Exosphere</h1>
          <p className="text-gray-600 mt-2">Let's get you set up</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {currentStep === 'choice' && (
            <OrganizationChoice onChoice={handleOrganizationChoice} />
          )}
          
          {currentStep === 'join' && (
            <JoinOrganization 
              onSuccess={handleJoinSuccess}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'create' && (
            <CreateOrganization 
              onSuccess={handleCreateSuccess}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'userInfo' && (
            <UserInfoForm 
              organizationId={selectedOrganizationId}
              onComplete={handleUserInfoComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};
