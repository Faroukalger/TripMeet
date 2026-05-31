import { LanguageProvider } from './src/i18n/LanguageContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <LanguageProvider>
      <Navigation />
    </LanguageProvider>
  );
}
