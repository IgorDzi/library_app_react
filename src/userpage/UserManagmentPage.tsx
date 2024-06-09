import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import UserItem from './UserItem';
import { useApi } from '../ApiProvider';
import { GetUserDto } from '../api/dto/user.dto';
import AddUserDialog from './AddUserDialog';
import { useTranslation } from 'react-i18next';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<GetUserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const apiClient = useApi();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        console.error(t('userManagement.fetchFailed'));
      }
    } catch (error) {
      console.error(t('userManagement.fetchError'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await apiClient.getUserRole();
        if (response.success) {
          setRole(response.data);
        } else {
          console.error(t('userManagement.fetchRoleFailed'));
        }
      } catch (error) {
        console.error(t('userManagement.fetchRoleError'), error);
      }
    };
    fetchRole();
  }, [apiClient, t]);

  const handleAddUserClick = () => {
    setOpen(true);
  };

  const handleClose = (refresh: boolean) => {
    setOpen(false);
    if (refresh) {
      fetchUsers();
    }
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 4 }}>
        {t('userManagement.title')}
      </Typography>
      {role === 'ROLE_ADMIN' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          sx={{ marginBottom: 4 }}
        >
          {t('userManagement.addUser')}
        </Button>
      )}
      {users.length > 0 ? (
        users.map((user) => (
          <UserItem key={user.id} user={user} role={role} onUserUpdated={handleUserUpdated} />
        ))
      ) : (
        <Typography>{t('userManagement.noUsers')}</Typography>
      )}
      <AddUserDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default UserManagementPage;
