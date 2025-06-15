
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationChanges } from '@/hooks/useOrganizationChanges';
import { useOnboarding } from '@/hooks/useOnboarding';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresOnboarding = true 
}) => {
  const { isAuthenticated, needsOnboarding, loading } = useAuth();
  const { getUserOrganization } = useOnboarding();
  const [organizationId, setOrganizationId] = React.useState<string>();
  const location = useLocation();

  // Use organization changes hook if user has an organization
  useOrganizationChanges(organizationId);

  React.useEffect(() => {
    const fetchOrganization = async () => {
      if (isAuthenticated && !needsOnboarding) {
        const userOrg = await getUserOrganization();
        if (userOrg?.organization_id) {
          setOrganizationId(userOrg.organization_id);
        }
      }
    };

    fetchOrganization();
  }, [isAuthenticated, needsOnboarding, getUserOrganization]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user has completed onboarding but is trying to access onboarding page, redirect to dashboard
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to onboarding if user needs onboarding and route requires it
  if (needsOnboarding && requiresOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
