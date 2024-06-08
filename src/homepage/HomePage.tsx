import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Grid } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import { useApi } from '../ApiProvider';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const apiClient = useApi();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await apiClient.getUserRole();
      if (response.success) {
        setRole(response.data);
      } else {
        console.error('Failed to fetch user role');
      }
    };
    fetchUserRole();
  }, [apiClient]);

  const handleNavigateBooks = () => {
    navigate('/books');
  };

  const handleNavigateLoans = () => {
    navigate('/loans');
  };

  const handleNavigateUsers = () => {
    navigate('/users');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom component="div" align="center" style={{ margin: '20px 0' }}>
        Welcome to the Library
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigateBooks}
            startIcon={<LibraryBooksIcon />}
            style={{
              backgroundColor: '#1976e2',
              color: 'white',
              padding: '10px 20px',
            }}
          >
            View Books
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNavigateLoans}
            startIcon={<AccountBalanceWalletIcon />}
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              padding: '10px 20px',
            }}
          >
            View Loans
          </Button>
        </Grid>
        {role === 'ROLE_ADMIN' && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigateUsers}
              startIcon={<PeopleIcon />}
              style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '10px 20px',
              }}
            >
              Manage Users
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
