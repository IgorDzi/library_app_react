// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './loginform/LoginForm';
import About from './aboutpage/About';
import Contact from './contactpage/Contact';
import Navbar from './navbar/Navbar';
import BookList from './booklist/BookList';
import HomePage from './homepage/HomePage'; // Import the HomePage component
import { mockBooks } from './booklist/mockBooks';
import './App.css';
import LoanList from './loanlist/LoanList';
import { mockLoans } from './loanlist/mockLoans';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/books" element={<BookList books={mockBooks} />} />
          <Route path="/loans" element={<LoanList loans={mockLoans} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
