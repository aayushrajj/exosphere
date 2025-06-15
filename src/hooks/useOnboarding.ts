
import { useOnboardingStatus } from './useOnboardingStatus';
import { useOrganizationValidation } from './useOrganizationValidation';
import { useOrganizationOperations } from './useOrganizationOperations';

export const useOnboarding = () => {
  const { checkOnboardingStatus, getUserOrganization } = useOnboardingStatus();
  const { validateOrgCode } = useOrganizationValidation();
  const { loading, createOrganization, joinOrganization } = useOrganizationOperations();

  return {
    loading,
    checkOnboardingStatus,
    validateOrgCode,
    createOrganization,
    joinOrganization,
    getUserOrganization,
  };
};
