// components/LoanItem.tsx
import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Loan } from './GetLoanDto';

interface LoanItemProps {
  loan: Loan;
}

const LoanItem: React.FC<LoanItemProps> = ({ loan }) => {
  const calculateDaysRemaining = (dueDate: string | null): number => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
  };

  const daysRemaining = calculateDaysRemaining(loan.returnDate);
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
          Book: {loan.book.title} by {loan.book.author}
        </Typography>
        <Typography variant="subtitle2">
          Borrower: {loan.user} (ID: {})
        </Typography>
        <Typography color="text.secondary">
          Loan Date: {loan.loanDate}
        </Typography>
        <Typography color="text.secondary">
          Due Date: {loan.returnDate || 'Not Returned'}
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
      </CardContent>
    </Card>
  );
};

export default LoanItem;
