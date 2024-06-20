import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { GetBookDto } from '../api/dto/books.dto';
import { useTranslation } from 'react-i18next';

interface BookItemProps {
  book: GetBookDto;
  role: string | null;
  onDelete: (id: number) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, role, onDelete }) => {
  const { t } = useTranslation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  const handleDelete = () => {
    if (book.id !== undefined) {
      onDelete(book.id);
    }
    closeDeleteConfirmDialog();
  };

  const openDeleteConfirmDialog = () => {
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmDialog = () => {
    setDeleteConfirmOpen(false);
  };

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
        {role === 'ROLE_ADMIN' && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={openDeleteConfirmDialog}
              sx={{ marginTop: 1, marginLeft: 1 }}
            >
              {t('bookItem.delete')}
            </Button>
            <Dialog
              open={deleteConfirmOpen}
              onClose={closeDeleteConfirmDialog}
            >
              <DialogTitle>{t('bookItem.deleteBookTitle')}</DialogTitle>
              <DialogContent>
                <Typography>{t('bookItem.deleteBookConfirmation')}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDeleteConfirmDialog} color="primary">
                  {t('bookItem.cancel')}
                </Button>
                <Button onClick={handleDelete} color="secondary">
                  {t('bookItem.delete')}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookItem;
