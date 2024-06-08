import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import LoanItem from './LoanItem';
import { useApi } from '../ApiProvider';
import { GetLoanDto } from '../api/dto/loans.dto';
import BeginLoanDialog from './BeginLoanDialog';

const LoanList: React.FC = () => {
  const [loans, setLoans] = useState<GetLoanDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const apiClient = useApi();

  const fetchLoans = async () => {
    try {
      const response = await apiClient.getLoans();
      if (response.success) {
        setLoans(response.data || []);
      } else {
        console.error('Failed to fetch loans');
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
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

  const handleAddLoanClick = () => {
    setOpen(true);
  };

  const handleClose = (refresh: boolean) => {
    setOpen(false);
    if (refresh) {
      fetchLoans();
    }
  };

  const handleLoanEnded = () => {
    fetchLoans();
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 4 }}>
        Loan List
      </Typography>
      {role === 'ROLE_ADMIN' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddLoanClick}
          sx={{ marginBottom: 4 }}
        >
          Add Loan
        </Button>
      )}
      {loans.length > 0 ? (
        loans.map((loan) => (
          <LoanItem key={loan.id} loan={loan} role={role} onLoanEnded={handleLoanEnded} />
        ))
      ) : (
        <Typography>No loans available</Typography>
      )}
      <BeginLoanDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default LoanList;
