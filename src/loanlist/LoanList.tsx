// components/LoanList.tsx
import React from 'react';
import { Container, Typography } from '@mui/material';
import LoanItem from './LoanItem';
import { Loan } from './GetLoanDto';

interface LoanListProps {
  loans: Loan[];
}

const LoanList: React.FC<LoanListProps> = ({ loans }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Loans Overview
      </Typography>
      {loans.map((loan) => (
        <LoanItem key={loan.id} loan={loan} />
      ))}
    </Container>
  );
};

export default LoanList;
