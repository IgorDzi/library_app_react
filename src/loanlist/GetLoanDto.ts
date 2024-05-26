import { GetBookDto } from '../booklist/GetBookDto';

export interface Loan {
  id: number;
  book: GetBookDto;
  user: string;
  loanDate: string;
  days: number;
  returnDate: string | null;
}
