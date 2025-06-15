
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrganizationAboutCardProps {
  description: string;
}

const OrganizationAboutCard: React.FC<OrganizationAboutCardProps> = ({ description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default OrganizationAboutCard;
