// dto/GetBookDto.ts
export interface GetBookDto {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  isAvailable: boolean;
}
