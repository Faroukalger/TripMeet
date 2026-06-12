import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { LanguageProvider } from './src/i18n/LanguageContext';
import Navigation from './src/navigation';
import { navigationRef } from './src/navigationRef';
import { supabase } from './src/lib/supabase';

export default function App() {
  useEffect(() => {
    // Quand l'app est ouverte via le lien de confirmation email (tripmeet://...)
    const handleDeepLink = async (url) => {
      if (!url) return;
      try {
        // Les jetons de session arrivent après le # (ou le ?) dans l'URL
        const after = url.split('#')[1] || url.split('?')[1] || '';
        const params = {};
        after.split('&').forEach(pair => {
          const [key, val] = pair.split('=');
          if (key) params[key] = decodeURIComponent(val || '');
        });

        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (!error && navigationRef.isReady()) {
            navigationRef.navigate('Hotel');
          }
        }
      } catch (e) {
        console.log('Erreur deep link:', e);
      }
    };

    // 1) App ouverte depuis zéro via le lien
    Linking.getInitialURL().then(handleDeepLink);
    // 2) App déjà ouverte quand le lien est cliqué
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

    return () => sub.remove();
  }, []);

  return (
    <LanguageProvider>
      <Navigation />
    </LanguageProvider>
  );
}
