import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

const getDeviceLanguage = () => {
  const locale = Localization.getLocales()?.[0]?.languageCode || 'fr';
  const supported = ['fr','en','ar','es','it','de'];
  return supported.includes(locale) ? locale : 'fr';
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getDeviceLanguage());

  useEffect(() => {
    AsyncStorage.getItem('tripmeet_language').then(lang => {
      if (lang) setLanguageState(lang);
    });
  }, []);

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('tripmeet_language', lang);
  };

  const t = (key) => translations[language]?.[key] || translations['fr']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export const LANGUAGES = [
  { code:'fr', name:'Français',  flag:'🇫🇷', rtl:false },
  { code:'en', name:'English',   flag:'🇬🇧', rtl:false },
  { code:'ar', name:'العربية',   flag:'🇸🇦', rtl:true  },
  { code:'es', name:'Español',   flag:'🇪🇸', rtl:false },
  { code:'it', name:'Italiano',  flag:'🇮🇹', rtl:false },
  { code:'de', name:'Deutsch',   flag:'🇩🇪', rtl:false },
];
