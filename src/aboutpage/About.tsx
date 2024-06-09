import React from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <h2>{t('aboutPage.title')}</h2>
      <p>{t('aboutPage.description')}</p>
    </div>
  );
};

export default About;
