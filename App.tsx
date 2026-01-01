
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ImageConverterPage from './pages/ImageConverterPage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import PdfToImagesPage from './pages/PdfToImagesPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import AnalyticsTracker from './components/AnalyticsTracker';
import { LanguageProvider } from './i18n/LanguageProvider';

const AppContent: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <AnalyticsTracker />
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/image-converter" element={<ImageConverterPage />} />
                    <Route path="/image-compressor" element={<ImageCompressorPage />} />
                    <Route path="/pdf-to-jpg" element={<PdfToImagesPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
          <AppContent />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
