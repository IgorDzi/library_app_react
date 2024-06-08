import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import UserItem from './UserItem';
import { useApi } from '../ApiProvider';
import { GetUserDto } from '../api/dto/user.dto';
import AddUserDialog from './AddUserDialog';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<GetUserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const apiClient = useApi();

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
          console.error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchRole();
  }, [apiClient]);

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
        Users
      </Typography>
      {role === 'ROLE_ADMIN' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          sx={{ marginBottom: 4 }}
        >
          Add User
        </Button>
      )}
      {users.length > 0 ? (
        users.map((user) => (
          <UserItem key={user.id} user={user} role={role} onUserUpdated={handleUserUpdated} />
        ))
      ) : (
        <Typography>No users available</Typography>
      )}
      <AddUserDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default UserManagementPage;
