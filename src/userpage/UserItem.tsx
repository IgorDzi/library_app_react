import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetUserDto, UpdatePasswordDto } from '../api/dto/user.dto';

interface UserItemProps {
  user: GetUserDto;
  role: string | null;
  onUserUpdated: () => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, role, onUserUpdated }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const apiClient = useApi();

  useEffect(() => {
    const fetchUsernameAndRole = async () => {
      try {
        const usernameResponse = await apiClient.getUsername(user.id);
        const userRoleResponse = await apiClient.getUserRoleById(user.id);
        if (usernameResponse.success && userRoleResponse.success) {
          setUsername(usernameResponse.data || '');
          setUserRole(userRoleResponse.data || '');
        } else {
          console.error('Failed to fetch username or user role');
        }
      } catch (error) {
        console.error('Error fetching username or user role:', error);
      }
    };

    fetchUsernameAndRole();
  }, [apiClient, user.id]);

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const data: UpdatePasswordDto = { username, password: newPassword };
      const response = await apiClient.updatePassword(data);
      if (response.success) {
        onUserUpdated();
        alert('Password updated successfully');
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const openConfirmDialog = () => {
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          User ID: {user.id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Full Name: {user.fullName}
        </Typography>
        <Typography variant="subtitle2">
          Username: {username}
        </Typography>
        <Typography color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography color="text.secondary">
          Role: {userRole}
        </Typography>
        {role === 'ROLE_ADMIN' && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={openConfirmDialog}
              sx={{ marginTop: 2, backgroundColor: 'purple' }}
            >
              Update Password
            </Button>
            <Dialog
              open={confirmOpen}
              onClose={closeConfirmDialog}
            >
              <DialogTitle>Update Password</DialogTitle>
              <DialogContent>
                <TextField
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleUpdatePassword} color="secondary">
                  Update Password
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserItem;
