import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudentDirectory from '@/components/StudentDirectory';
import Textbooks from '@/components/Textbooks';
import MinistryResults from '@/components/MinistryResults';
import ExamResults from '@/components/ExamResults';
import ReportCard from '@/components/ReportCard';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('directory');

  const renderContent = () => {
    switch (activeTab) {
      case 'directory': return <StudentDirectory />;
      case 'textbooks': return <Textbooks />;
      case 'ministry': return <MinistryResults />;
      case 'mid': return <ExamResults type="mid" />;
      case 'final': return <ExamResults type="final" />;
      case 'report': return <ReportCard />;
      default: return <StudentDirectory />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
