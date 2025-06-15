
import { useState } from 'react';
import { useOrganizationData } from '@/hooks/useOrganizationData';
import AppSidebar from '@/components/layout/AppSidebar';
import AppTopBar from '@/components/layout/AppTopBar';
import OrganizationHeader from '@/components/organization/OrganizationHeader';
import ExecutivesTable from '@/components/organization/ExecutivesTable';
import NoOrganizationMessage from '@/components/organization/NoOrganizationMessage';

const YourOrganisation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userName, organizationData, loading } = useOrganizationData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <AppSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        currentPath="/your-organisation"
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Top bar */}
        <AppTopBar 
          setSidebarOpen={setSidebarOpen}
          title="Your Organisation"
          subtitle="Manage your organization and team"
        />

        {/* Organization content */}
        <div className="px-4 py-6 sm:px-6">
          {organizationData ? (
            <>
              <OrganizationHeader 
                organizationName={organizationData.name}
                executiveCount={organizationData.executives.length}
              />
              <ExecutivesTable executives={organizationData.executives} />
            </>
          ) : (
            <NoOrganizationMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export default YourOrganisation;
