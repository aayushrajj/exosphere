
import { Building2 } from 'lucide-react';

const NoOrganizationMessage = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Organization Found</h3>
      <p className="text-gray-600">You are not currently part of any organization.</p>
    </div>
  );
};

export default NoOrganizationMessage;
