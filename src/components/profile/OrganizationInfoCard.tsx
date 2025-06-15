
import React from 'react';
import { Building2, Copy, Globe, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OrganizationInfo {
  id: string;
  name: string;
  org_code: string;
  domain?: string;
  founding_year?: number;
  description: string;
}

interface OrganizationInfoCardProps {
  organization: OrganizationInfo;
}

const OrganizationInfoCard: React.FC<OrganizationInfoCardProps> = ({ organization }) => {
  const { toast } = useToast();

  const copyOrgCode = () => {
    navigator.clipboard.writeText(organization.org_code);
    toast({
      title: "Copied!",
      description: "Organization code copied to clipboard",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Organization Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Organization Name</label>
            <p className="text-lg font-semibold text-gray-900">{organization.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Organization Code</label>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono">
                {organization.org_code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOrgCode}
                className="flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share this code with others to invite them to your organization
            </p>
          </div>

          {organization.domain && (
            <div>
              <label className="text-sm font-medium text-gray-600">Domain</label>
              <p className="text-lg text-gray-900 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {organization.domain}
              </p>
            </div>
          )}

          {organization.founding_year && (
            <div>
              <label className="text-sm font-medium text-gray-600">Founded</label>
              <p className="text-lg text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {organization.founding_year}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 col-span-full">
        <CardHeader>
          <CardTitle>About the Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{organization.description}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default OrganizationInfoCard;
