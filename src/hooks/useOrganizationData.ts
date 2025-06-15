
import { useUserProfile } from './useUserProfile';
import { useUserOrganization } from './useUserOrganization';
import { useOrganizationExecutives } from './useOrganizationExecutives';

interface Executive {
  id: string;
  full_name: string;
  executive_role: string;
  created_at: string;
}

interface OrganizationData {
  name: string;
  executives: Executive[];
}

export const useOrganizationData = () => {
  const { userName, loading: profileLoading } = useUserProfile();
  const { userOrganization, loading: orgLoading } = useUserOrganization();
  const { executives, loading: executivesLoading } = useOrganizationExecutives(
    userOrganization?.organization_id || null
  );

  const loading = profileLoading || orgLoading || executivesLoading;

  const organizationData: OrganizationData | null = userOrganization
    ? {
        name: userOrganization.name,
        executives
      }
    : null;

  return { userName, organizationData, loading };
};
