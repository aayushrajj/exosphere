
import React, { useState } from 'react';
import { Trash2, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DangerZoneCardProps {
  isCEO: boolean;
  organizationName: string;
  organizationId: string;
  organizationUserCount: number;
  executiveRole: string;
}

const DangerZoneCard: React.FC<DangerZoneCardProps> = ({
  isCEO,
  organizationName,
  organizationId,
  organizationUserCount,
  executiveRole
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOrgPassword, setDeleteOrgPassword] = useState('');
  const [deleteUserPassword, setDeleteUserPassword] = useState('');

  const getUserDeletionConsequences = () => {
    const isLastUser = organizationUserCount === 1;
    const hasOtherUsers = organizationUserCount > 1;

    if (isLastUser) {
      return {
        title: "Delete Account & Organization",
        description: "You are the only member of this organization. Deleting your account will also permanently delete the entire organization.",
        consequences: [
          "Your account and profile will be deleted",
          "The entire organization will be deleted",
          "All organization data will be permanently lost",
          "This action cannot be undone"
        ],
        icon: AlertTriangle,
        buttonText: "Delete Account & Organization"
      };
    } else if (isCEO && hasOtherUsers) {
      return {
        title: "Delete Account & Transfer CEO Role",
        description: "You are the CEO with other team members. Deleting your account will automatically promote another member to CEO.",
        consequences: [
          "Your account and profile will be deleted",
          "CEO role will be transferred to the next senior member",
          "The organization will continue with the new CEO",
          "This action cannot be undone"
        ],
        icon: User,
        buttonText: "Delete Account & Transfer CEO"
      };
    } else {
      return {
        title: "Delete Account",
        description: "Deleting your account will remove you from the organization.",
        consequences: [
          "Your account and profile will be deleted",
          "You will be removed from the organization",
          "The organization will continue without you",
          "This action cannot be undone"
        ],
        icon: User,
        buttonText: "Delete My Account"
      };
    }
  };

  const verifyPasswordAndDeleteOrganization = async () => {
    if (!organizationId || !deleteOrgPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }
    
    setDeleteLoading(true);
    try {
      // First verify the password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast({
          title: "Error",
          description: "Unable to verify user credentials.",
          variant: "destructive",
        });
        setDeleteLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deleteOrgPassword
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setDeleteOrgPassword('');
        setDeleteLoading(false);
        return;
      }

      // If password is correct, proceed with deletion
      const { error } = await supabase.rpc('delete_organization', {
        org_id: organizationId
      });

      if (error) {
        console.error('Delete organization error:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Organization Deleted",
          description: "The organization and all its data have been permanently deleted.",
        });
        
        // Sign out the user after deleting organization
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected delete organization error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the organization.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteOrgPassword('');
    }
  };

  const verifyPasswordAndDeleteUser = async () => {
    if (!deleteUserPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Unable to verify user credentials.",
        variant: "destructive",
      });
      return;
    }

    setDeleteLoading(true);
    try {
      // First verify the password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deleteUserPassword
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setDeleteUserPassword('');
        setDeleteLoading(false);
        return;
      }

      // If password is correct, proceed with deletion
      const { error } = await supabase.rpc('delete_user_data', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Delete user error:', error);
        toast({
          title: "Error",
          description: "Failed to delete user data. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "User Data Deleted",
          description: "Your user data has been permanently deleted.",
        });
        
        // Sign out the user after deleting their data
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected delete user error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting user data.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteUserPassword('');
    }
  };

  const deletionInfo = getUserDeletionConsequences();

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-700">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delete Organization Button - Only for CEO */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Delete Organization</h4>
            <p className="text-sm text-gray-600">
              Permanently delete this organization and all associated data. This action cannot be undone.
              {!isCEO && " (Only available to CEO)"}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={!isCEO || deleteLoading}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Organization
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the organization "{organizationName}" and all associated data including:
                  <ul className="list-disc ml-6 mt-2 mb-4">
                    <li>All user accounts in this organization</li>
                    <li>All chat logs and data</li>
                    <li>Organization settings and information</li>
                  </ul>
                  <strong>This action cannot be undone.</strong>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your password to confirm:
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={deleteOrgPassword}
                      onChange={(e) => setDeleteOrgPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteOrgPassword('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={verifyPasswordAndDeleteOrganization}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteLoading || !deleteOrgPassword.trim()}
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete Organization"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Delete User Button with Enhanced Confirmation */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Delete Your Account</h4>
            <p className="text-sm text-gray-600">
              Permanently delete your user account and all associated data. This action cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteLoading}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <deletionInfo.icon className="h-5 w-5 mr-2" />
                  {deletionInfo.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {deletionInfo.description}
                  <div className="mt-4 mb-4">
                    <strong>What will happen:</strong>
                    <ul className="list-disc ml-6 mt-2">
                      {deletionInfo.consequences.map((consequence, index) => (
                        <li key={index}>{consequence}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your password to confirm:
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={deleteUserPassword}
                      onChange={(e) => setDeleteUserPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteUserPassword('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={verifyPasswordAndDeleteUser}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteLoading || !deleteUserPassword.trim()}
                >
                  {deleteLoading ? "Deleting..." : deletionInfo.buttonText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneCard;
