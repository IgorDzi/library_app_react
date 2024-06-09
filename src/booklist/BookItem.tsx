import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { GetBookDto } from '../api/dto/books.dto';
import { useTranslation } from 'react-i18next';

interface BookItemProps {
  book: GetBookDto;
}

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  const { t } = useTranslation();

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
          <strong>{t('bookItem.publisher')}:</strong> {book.publisher}
          <br />
          <strong>{t('bookItem.year')}:</strong> {book.publicationYear}
          <br />
          <strong>{t('bookItem.isbn')}:</strong> {book.isbn}
        </Typography>
        <Chip
          label={book.available ? t('bookItem.available') : t('bookItem.notAvailable')}
          color={book.available ? 'success' : 'error'}
          sx={{ marginTop: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default BookItem;
