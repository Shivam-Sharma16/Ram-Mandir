'use client';

import { useEffect } from 'react';

// Declaration to prevent TypeScript errors for the window callback
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // 1. Define the initialization function that Google's script expects to find
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi', // We only need English and Hindi
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // 2. Inject the script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    // This div will be hidden via CSS in globals.css so the user never sees the default UI
    <div id="google_translate_element" style={{ display: 'none' }}></div>
  );
}
