
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pl' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/home">{t('home')}</Link>
        <Link to="/about">{t('about')}</Link>
        <Link to="/contact">{t('contact')}</Link>
      </div>
      <div className="language-toggle-container">
        <button className="language-toggle-btn" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faGlobe} /> {i18n.language === 'en' ? 'EN' : 'PL'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
