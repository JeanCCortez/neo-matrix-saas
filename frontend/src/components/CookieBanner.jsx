import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(false);
  const { t } = useI18n();

  // Verificar se o usuário já aceitou os cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted === 'true') {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 p-4 z-50 border-t border-dark-600">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          {t('cookieBanner.message')}{' '}
          <a href="/privacy" className="text-quantum-400 hover:underline" target="_blank" rel="noopener noreferrer">
            {t('cookieBanner.privacyPolicy')}
          </a>.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="btn-primary px-4 py-2 text-sm"
          >
            {t('cookieBanner.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}