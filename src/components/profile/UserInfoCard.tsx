
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserInfoCardProps {
  fullName: string;
  executiveRole: string;
  organizationUserCount: number;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  fullName,
  executiveRole,
  organizationUserCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <p className="text-lg font-semibold text-gray-900">{fullName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Executive Role</label>
          <p className="text-lg font-semibold text-gray-900">{executiveRole}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Organization Members</label>
          <p className="text-lg text-gray-900">{organizationUserCount} {organizationUserCount === 1 ? 'member' : 'members'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
