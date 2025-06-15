
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
        try {
          const userOrg = await getUserOrganization();
          if (userOrg?.organization_id) {
            setOrganizationId(userOrg.organization_id);
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      }
    };

    fetchOrganization();
  }, [isAuthenticated, needsOnboarding, getUserOrganization]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    console.log('Redirecting to login - user not authenticated');
    return <Navigate to="/login" replace />;
  }

  // If user has completed onboarding but is trying to access onboarding page, redirect to dashboard
  if (!needsOnboarding && location.pathname === '/onboarding') {
    console.log('Redirecting to dashboard - onboarding already completed');
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to onboarding if user needs onboarding and route requires it
  if (needsOnboarding && requiresOnboarding) {
    console.log('Redirecting to onboarding - user needs to complete onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
