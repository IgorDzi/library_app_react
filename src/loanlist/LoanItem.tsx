import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../api/dto/books.dto';
import { GetUserDto } from '../api/dto/user.dto';
import { GetLoanDto } from '../api/dto/loans.dto';

interface LoanItemProps {
  loan: GetLoanDto;
  role: string | null;
  onLoanEnded: () => void;
}

const LoanItem: React.FC<LoanItemProps> = ({ loan, role, onLoanEnded }) => {
  const [book, setBook] = useState<GetBookDto | null>(null);
  const [user, setUser] = useState<GetUserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const apiClient = useApi();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [bookResponse, userResponse] = await Promise.all([
          apiClient.getBook(loan.book),
          apiClient.getUser(loan.user)
        ]);

        if (bookResponse.success && userResponse.success) {
          setBook(bookResponse.data);
          setUser(userResponse.data);
        } else {
          console.error('Failed to fetch book or user details');
        }
      } catch (error) {
        console.error('Error fetching book or user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [apiClient, loan.book, loan.user]);

  const handleEndLoan = async () => {
    try {
      const response = await apiClient.endLoan(loan.id);
      if (response.success) {
        onLoanEnded();
      } else {
        alert('Failed to end loan');
      }
    } catch (error) {
      console.error('Error ending loan:', error);
    } finally {
      setConfirmOpen(false);
    }
  };

  const openConfirmDialog = () => {
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!book || !user) {
    return <Typography color="error">Error loading loan details</Typography>;
  }

  const calculateDueDate = (loanDate: string, days: number): Date => {
    const dueDate = new Date(loanDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
  };

  const calculateDaysRemaining = (dueDate: Date): number => {
    const now = new Date();
    return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  };

  const dueDate = loan.returnDate ? new Date(loan.returnDate) : calculateDueDate(loan.loanDate, loan.days);
  const daysRemaining = calculateDaysRemaining(dueDate);
  const isReturned = loan.returnDate !== null;
  const loanStatus = isReturned ? 'Returned' : 'Not Returned';
  const statusColor = isReturned ? 'success' : 'error';

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Loan ID: {loan.id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Book: {book.title} by {book.author}
        </Typography>
        <Typography variant="subtitle2">
          Borrower: {user.fullName} (ID: {user.id})
        </Typography>
        <Typography color="text.secondary">
          Loan Date: {loan.loanDate}
        </Typography>
        <Typography color="text.secondary">
          Return Date: {dueDate.toISOString().split('T')[0]}
        </Typography>
        <Chip
          label={loanStatus}
          color={statusColor}
          sx={{ marginRight: 1, marginTop: 1 }}
        />
        {!isReturned && (
          <Chip
            label={`Days Remaining: ${daysRemaining}`}
            color={daysRemaining < 0 ? 'error' : 'primary'}
            sx={{ marginTop: 1 }}
          />
        )}
        {role === 'ROLE_ADMIN' && !isReturned && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={openConfirmDialog}
              sx={{ marginTop: 2 }}
            >
              End Loan
            </Button>
            <Dialog
              open={confirmOpen}
              onClose={closeConfirmDialog}
            >
              <DialogTitle>Confirm End Loan</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to end this loan?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleEndLoan} color="secondary">
                  End Loan
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanItem;
