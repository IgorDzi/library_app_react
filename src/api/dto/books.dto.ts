export interface GetBookDto {
  publicationYear: number | undefined;
  id: number | undefined;
  isbn: string| undefined;
  title: string| undefined;
  author: string| undefined;
  publisher: string| undefined;
  available: boolean;
}
export interface CreateBookDto {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  availableCopies: number;
}

export interface CreateBookResponseDto {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  availableCopies: number;
}

export type GetAllBooksDto = GetBookDto[];