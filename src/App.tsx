import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BmiDialog } from './components/BmiDialog';
import { Footer } from './components/Footer';
import { GoalsDialog } from './components/GoalsDialog';
import { Header } from './components/Header';
import { UiProvider } from './components/UiContext';
import CategoryPage from './pages/CategoryPage';
import Home from './pages/Home';
import { ContactPage, FaqPage, LegalPage, NotFound } from './pages/InfoPages';
import StartPage from './pages/StartPage';
import TreatmentPage from './pages/TreatmentPage';

/** Scrolls to the top on page change, or to #section when the URL has a hash (e.g. /#how). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); return; }
    let tries = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 20) setTimeout(find, 60);
    };
    find();
  }, [pathname, hash]);
  return null;
}

const LEGAL_ROUTES = ['privacy-policy', 'terms-of-service', 'telehealth-consent', 'cancellation-policy', 'hipaa-notice'] as const;

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <UiProvider>
        <ScrollManager />
        <Header />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main"
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {LEGAL_ROUTES.map((s) => <Route key={s} path={`/${s}`} element={<LegalPage slug={s} />} />)}
              <Route path="/start/:slug" element={<StartPage />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/:category/:slug" element={<TreatmentPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Footer />
        <GoalsDialog />
        <BmiDialog />
      </UiProvider>
    </MotionConfig>
  );
}
