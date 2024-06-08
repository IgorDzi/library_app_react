import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import BookItem from './BookItem';
import { GetBookDto } from '../api/dto/books.dto';
import { useApi } from '../ApiProvider';
import AddBookDialog from './AddBookDialog';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const apiClient = useApi();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getBooks();
      if (response.success) {
        setBooks(response.data || []);
      } else {
        console.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

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
          console.error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchRole();
  }, [apiClient]);

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
        Book List
      </Typography>
      {role === 'ROLE_ADMIN' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBookClick}
          sx={{ marginBottom: 4 }}
        >
          Add Book
        </Button>
      )}
      {books.length > 0 ? (
        books.map((book) => <BookItem key={book.id} book={book} />)
      ) : (
        <Typography>No books available</Typography>
      )}
      <AddBookDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default BookList;
