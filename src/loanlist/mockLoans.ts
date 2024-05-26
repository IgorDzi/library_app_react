// mockData/mockLoans.ts

import { Loan } from './GetLoanDto';
import { mockBooks } from '../booklist/mockBooks';

export const mockLoans: Loan[] = [
  {
    id: 1,
    book: mockBooks[1],
    user: 'John Doe',
    loanDate: '2023-01-01',
    days: 30,
    returnDate: '2023-01-31',
  },
  {
    id: 2,
    book: mockBooks[2],
    user: 'Jane Smith',
    loanDate: '2023-02-01',
    days: 45,
    returnDate: null,
  },
];
