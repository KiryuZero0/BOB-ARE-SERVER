// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationRO from './locales/ro/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            ro: { translation: translationRO },
        },
        lng: localStorage.getItem('lang') || 'ro',
        fallbackLng: 'ro',
        interpolation: { escapeValue: false },
    });

export default i18n;
