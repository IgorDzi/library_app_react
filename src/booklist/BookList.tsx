import React from 'react';
import { Container, Typography } from '@mui/material';
import BookItem from './BookItem';
import { GetBookDto } from './GetBookDto';

interface BookListProps {
  books: GetBookDto[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <Container>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 4 }}>
        Book List
      </Typography>
      {books.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </Container>
  );
};

export default BookList;
