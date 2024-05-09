// BookItem.tsx
import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { GetBookDto } from './GetBookDto';

interface BookItemProps {
  book: GetBookDto;
}

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {book.author}
        </Typography>
        <Typography variant="body2">
          <strong>Publisher:</strong> {book.publisher}
          <br />
          <strong>Year:</strong> {book.publicationYear}
          <br />
          <strong>ISBN:</strong> {book.isbn}
        </Typography>
        <Chip
          label={book.isAvailable ? 'Available' : 'Not Available'}
          color={book.isAvailable ? 'success' : 'error'}
          sx={{ marginTop: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default BookItem;
