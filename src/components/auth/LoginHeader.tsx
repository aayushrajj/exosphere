
import { Building2 } from 'lucide-react';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
        <Building2 className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Exosphere</h1>
      <p className="text-gray-600 mt-2">Your C-Suite Intelligent Platform</p>
    </div>
  );
};

export default LoginHeader;
