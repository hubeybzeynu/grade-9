import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import PasswordGate from '@/components/PasswordGate';
import WelcomeOnboarding from '@/components/WelcomeOnboarding';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import TextbooksPage from '@/components/TextbooksPage';
import StudentsPage from '@/components/StudentsPage';
import ResultsPage from '@/components/ResultsPage';
import ExamResultPage from '@/components/ExamResultPage';
import ReportCardPage from '@/components/ReportCardPage';
import InfoPage from '@/components/InfoPage';

const Index = () => {
  const [splashDone, setSplashDone] = useState(() => sessionStorage.getItem('splash_shown') === 'true');
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('portal_unlocked') === 'true');
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('portal_onboarded') === 'true');
  const [currentPage, setCurrentPage] = useState('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);

  const navigateTo = useCallback((page: string) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  }, []);

  // Android back button handling
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (pageHistory.length > 1) {
        const newHistory = [...pageHistory];
        newHistory.pop();
        setPageHistory(newHistory);
        setCurrentPage(newHistory[newHistory.length - 1]);
        window.history.pushState(null, '', window.location.href);
      }
      // If only home left, let the browser/app close naturally
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pageHistory]);

  // Push state on navigation
  useEffect(() => {
    if (pageHistory.length > 1) {
      window.history.pushState(null, '', window.location.href);
    }
  }, [currentPage]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash_shown', 'true');
    setSplashDone(true);
  };

  const handleUnlock = () => {
    localStorage.setItem('portal_unlocked', 'true');
    setUnlocked(true);
  };

  const handleOnboardComplete = () => {
    localStorage.setItem('portal_onboarded', 'true');
    setOnboarded(true);
  };

  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  if (!onboarded) {
    return (
      <AnimatePresence>
        <WelcomeOnboarding onComplete={handleOnboardComplete} />
      </AnimatePresence>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'textbooks': return <TextbooksPage />;
      case 'students': return <StudentsPage onNavigate={navigateTo} />;
      case 'results': return <ResultsPage />;
      case 'mid': return <ExamResultPage type="mid" />;
      case 'final': return <ExamResultPage type="final" />;
      case 'report': return <ReportCardPage />;
      case 'info': return <InfoPage onBack={() => navigateTo('home')} />;
      default: return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <AnimatePresence mode="wait">
        <div key={currentPage}>
          {renderPage()}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
