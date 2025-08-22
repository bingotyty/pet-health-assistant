import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nProvider } from '../lib/i18n';

export default function App({ Component, pageProps }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </I18nProvider>
  );
}