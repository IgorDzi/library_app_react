import React from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <h2>{t('contactPage.title')}</h2>
      <p>
        {t('contactPage.author')}: Igor Dziubek <br />
        {t('contactPage.index')} : 268385
        <br /> {t('contactPage.email')}: 268385@student.pwr.edu.pl
      </p>
    </div>
  );
};

export default Contact;
