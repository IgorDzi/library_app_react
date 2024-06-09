

export interface GetLoanDto {
  id: number;
  book: number;
  user: number;
  loanDate: string;
  days: number;
  returnDate: string | null;
}
export interface BeginLoanDto {
  book: number;
  user: number;
  days: number;
}

export interface BeginLoanResponseDto {
  id: number;
  book: number;
  user: number;
  loanDate: string;
  returnDate: string | null;
}
export type GetAllLoansDto = GetLoanDto[];