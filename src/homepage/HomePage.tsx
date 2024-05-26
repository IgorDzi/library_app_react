import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Grid, Paper } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Icon for books
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Icon for loans

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateBooks = () => {
    navigate('/books');
  };

  const handleNavigateLoans = () => {
    navigate('/loans');
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        align="center"
        style={{ margin: '20px 0' }}
      >
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
      </Grid>
    </Container>
  );
};

export default HomePage;
