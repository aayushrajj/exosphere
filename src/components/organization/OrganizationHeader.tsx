
import { Building2 } from 'lucide-react';

interface OrganizationHeaderProps {
  organizationName: string;
  executiveCount: number;
}

const OrganizationHeader = ({ organizationName, executiveCount }: OrganizationHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Welcome to your organisation - {organizationName}
      </h3>
      <p className="text-gray-700 mb-2">
        Total executives from your org on Exosphere - {executiveCount}
      </p>
      <p className="text-gray-600">
        Below are the executives of your organisation present on Exosphere:
      </p>
    </div>
  );
};

export default OrganizationHeader;
