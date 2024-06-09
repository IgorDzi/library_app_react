import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetUserDto, UpdatePasswordDto } from '../api/dto/user.dto';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsernameAndRole = async () => {
      try {
        const usernameResponse = await apiClient.getUsername(user.id);
        const userRoleResponse = await apiClient.getUserRoleById(user.id);
        if (usernameResponse.success && userRoleResponse.success) {
          setUsername(usernameResponse.data || '');
          setUserRole(userRoleResponse.data || '');
        } else {
          console.error(t('userItem.fetchFailed'));
        }
      } catch (error) {
        console.error(t('userItem.fetchError'), error);
      }
    };

    fetchUsernameAndRole();
  }, [apiClient, user.id, t]);

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const data: UpdatePasswordDto = { username, password: newPassword };
      const response = await apiClient.updatePassword(data);
      if (response.success) {
        onUserUpdated();
        alert(t('userItem.updateSuccess'));
      } else {
        alert(t('userItem.updateFailed'));
      }
    } catch (error) {
      console.error(t('userItem.updateError'), error);
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
          {t('userItem.userId')}: {user.id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('userItem.fullName')}: {user.fullName}
        </Typography>
        <Typography variant="subtitle2">
          {t('userItem.username')}: {username}
        </Typography>
        <Typography color="text.secondary">
          {t('userItem.email')}: {user.email}
        </Typography>
        <Typography color="text.secondary">
          {t('userItem.role')}: {userRole}
        </Typography>
        {role === 'ROLE_ADMIN' && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={openConfirmDialog}
              sx={{ marginTop: 2, backgroundColor: 'purple' }}
            >
              {t('userItem.updatePassword')}
            </Button>
            <Dialog
              open={confirmOpen}
              onClose={closeConfirmDialog}
            >
              <DialogTitle>{t('userItem.updatePasswordTitle')}</DialogTitle>
              <DialogContent>
                <TextField
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('userItem.newPasswordPlaceholder')}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmDialog} color="primary">
                  {t('userItem.cancel')}
                </Button>
                <Button onClick={handleUpdatePassword} color="secondary">
                  {t('userItem.updatePassword')}
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
