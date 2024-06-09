import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../api/dto/books.dto';
import { GetUserDto } from '../api/dto/user.dto';
import { GetLoanDto } from '../api/dto/loans.dto';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
          console.error(t('loanItem.fetchDetailsFailed'));
        }
      } catch (error) {
        console.error(t('loanItem.fetchError'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [apiClient, loan.book, loan.user, t]);

  const handleEndLoan = async () => {
    try {
      const response = await apiClient.endLoan(loan.id);
      if (response.success) {
        onLoanEnded();
      } else {
        alert(t('loanItem.endFailed'));
      }
    } catch (error) {
      console.error(t('loanItem.errorEndingLoan'), error);
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
    return <Typography color="error">{t('loanItem.errorLoadingDetails')}</Typography>;
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
  const loanStatus = isReturned ? t('loanItem.returned') : t('loanItem.notReturned');
  const statusColor = isReturned ? 'success' : 'error';

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {t('loanItem.loanId')}: {loan.id}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('loanItem.book')}: {book.title} {t('loanItem.by')} {book.author}
        </Typography>
        <Typography variant="subtitle2">
          {t('loanItem.borrower')}: {user.fullName} (ID: {user.id})
        </Typography>
        <Typography color="text.secondary">
          {t('loanItem.loanDate')}: {loan.loanDate}
        </Typography>
        <Typography color="text.secondary">
          {t('loanItem.returnDate')}: {dueDate.toISOString().split('T')[0]}
        </Typography>
        <Chip
          label={loanStatus}
          color={statusColor}
          sx={{ marginRight: 1, marginTop: 1 }}
        />
        {!isReturned && (
          <Chip
            label={`${t('loanItem.daysRemaining')}: ${daysRemaining}`}
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
              {t('loanItem.endLoan')}
            </Button>
            <Dialog
              open={confirmOpen}
              onClose={closeConfirmDialog}
            >
              <DialogTitle>{t('loanItem.confirmEndLoan')}</DialogTitle>
              <DialogContent>
                <Typography>{t('loanItem.confirmEndLoanText')}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmDialog} color="primary">
                  {t('loanItem.cancel')}
                </Button>
                <Button onClick={handleEndLoan} color="secondary">
                  {t('loanItem.endLoan')}
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
