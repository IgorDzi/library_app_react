import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import BookItem from './BookItem';
import { GetBookDto } from '../api/dto/books.dto';
import { useApi } from '../ApiProvider';
import AddBookDialog from './AddBookDialog';
import { useTranslation } from 'react-i18next';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const apiClient = useApi();
  const { t } = useTranslation();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getBooks();
      if (response.success) {
        setBooks(response.data || []);
      } else {
        console.error(t('bookList.fetchFailed'));
      }
    } catch (error) {
      console.error(t('bookList.errorFetching'), error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, t]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await apiClient.getUserRole();
        if (response.success) {
          setRole(response.data);
        } else {
          console.error(t('bookList.fetchRoleFailed'));
        }
      } catch (error) {
        console.error(t('bookList.errorFetchingRole'), error);
      }
    };
    fetchRole();
  }, [apiClient, t]);

  const handleAddBookClick = () => {
    setOpen(true);
  };

  const handleClose = (refresh: boolean) => {
    setOpen(false);
    if (refresh) {
      fetchBooks();
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 4 }}>
        {t('bookList.title')}
      </Typography>
      {role === 'ROLE_ADMIN' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBookClick}
          sx={{ marginBottom: 4 }}
        >
          {t('bookList.addBook')}
        </Button>
      )}
      {books.length > 0 ? (
        books.map((book) => <BookItem key={book.id} book={book} />)
      ) : (
        <Typography>{t('bookList.noBooks')}</Typography>
      )}
      <AddBookDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default BookList;
