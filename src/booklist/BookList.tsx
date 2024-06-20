import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, CircularProgress, TextField, FormControlLabel, Checkbox, Grid } from '@mui/material';
import BookItem from './BookItem';
import { GetBookDto, SearchForBookDto } from '../api/dto/books.dto';
import { useApi } from '../ApiProvider';
import AddBookDialog from './AddBookDialog';
import { useTranslation } from 'react-i18next';
import './BookList.css';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchForBookDto>({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    isAvailable: false,
  });

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

  const searchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.searchBooks(searchCriteria);
      if (response.success) {
        setBooks(response.data || []);
      } else {
        console.error(t('bookList.searchFailed'));
      }
    } catch (error) {
      console.error(t('bookList.errorSearching'), error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, searchCriteria, t]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks();
  };

  const handleClearSearch = () => {
    setSearchCriteria({
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      isAvailable: false,
    });
  };

  const handleDeleteBook = async (id: number) => {
    setLoading(true);
    try {
      const response = await apiClient.deleteBook(id);
      if (response.success) {
        setBooks(books.filter(book => book.id !== id));
      } else {
        console.error(t('bookList.deleteFailed'));
      }
    } catch (error) {
      console.error(t('bookList.errorDeleting'), error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 4 }}>
        {t('bookList.bookTitle')}
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
      <form onSubmit={handleSearchSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('bookList.isbn')}
              name="isbn"
              value={searchCriteria.isbn}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('bookList.searchBookTitle')}
              name="title"
              value={searchCriteria.title}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('bookList.author')}
              name="author"
              value={searchCriteria.author}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('bookList.publisher')}
              name="publisher"
              value={searchCriteria.publisher}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isAvailable"
                  checked={searchCriteria.isAvailable}
                  onChange={handleSearchChange}
                />
              }
              label={t('bookList.isAvailable')}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              {t('bookList.search')}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleClearSearch}>
              {t('bookList.clearSearch')}
            </Button>
          </Grid>
        </Grid>
      </form>
      <div className="book-list-container">
        {books.length > 0 ? (
          books.map((book) => <BookItem key={book.id} book={book} role={role} onDelete={handleDeleteBook} />)
        ) : (
          <Typography>{t('bookList.noBooks')}</Typography>
        )}
      </div>
      <AddBookDialog open={open} onClose={handleClose} />
    </Container>
  );
};

export default BookList;
