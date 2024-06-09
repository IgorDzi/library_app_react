
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './loginform/LoginForm';
import About from './aboutpage/About';
import Contact from './contactpage/Contact';
import Navbar from './navbar/Navbar';
import BookList from './booklist/BookList';
import HomePage from './homepage/HomePage';
import LoanList from './loanlist/LoanList';
import ApiProvider from './ApiProvider';
import { AuthProvider } from './AuthContext';
import {I18nextProvider} from 'react-i18next'
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import UserManagementPage from './userpage/UserManagmentPage';
import i18n from './i18n';

const App: React.FC = () => {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ApiProvider>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/loans" element={<LoanList  />} />
                <Route path="/users" element={<UserManagementPage />} />
              </Route>
            </Routes>
          </div>
        </ApiProvider>
      </AuthProvider>
      </I18nextProvider>
    </Router>
  );
};

export default App;
