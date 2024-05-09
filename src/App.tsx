// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './loginform/LoginForm';
import About from './aboutpage/About';
import Contact from './contactpage/Contact';
import Navbar from './navbar/Navbar';
import BookList from './booklist/BookList';
import { mockBooks } from './booklist/mockBooks';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/books" element={<BookList books={mockBooks} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
