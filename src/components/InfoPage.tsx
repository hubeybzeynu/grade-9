import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, ChevronRight, MessageCircle, Users, User, 
  BookOpen, Award, ClipboardList, FileCheck, FileText, 
  Send, ArrowLeft, ExternalLink, HelpCircle
} from 'lucide-react';

interface InfoPageProps {
  onBack: () => void;
}

const InfoPage = ({ onBack }: InfoPageProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [helpMessage, setHelpMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    if (!helpMessage.trim()) return;
    // Placeholder - will be connected to Telegram bot later
    console.log('Help message:', helpMessage);
    setMessageSent(true);
    setHelpMessage('');
    setTimeout(() => setMessageSent(false), 3000);
  };

  const menuItems = [
    { key: 'about', label: 'About the App', icon: Info, color: 'bg-blue-500' },
    { key: 'help', label: 'Help', icon: HelpCircle, color: 'bg-emerald-500' },
    { key: 'telegram-channel', label: 'Telegram Channel', icon: MessageCircle, color: 'bg-sky-500', external: 'https://t.me/grade9studentstschannel' },
    { key: 'telegram-group', label: 'Telegram Group', icon: Users, color: 'bg-violet-500', external: 'https://t.me/grade9studentsts' },
    { key: 'contact', label: 'Contact', icon: User, color: 'bg-amber-500' },
  ];

  if (activeSection) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="min-h-screen pt-16 pb-20 px-4"
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-4 active:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Info
          </button>

          {activeSection === 'about' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-bold text-foreground mb-3">About Grade 9 Portal</h2>
              <div className="space-y-3">
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">📱 What is this app?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Grade 9 Portal is a comprehensive student hub designed for Grade 9 students at St. Theresa School. 
                    It provides easy access to all academic resources in one place, optimized for mobile use.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">📚 Features</h3>
                  <div className="space-y-2">
                    {[
                      { icon: BookOpen, text: 'Digital Textbooks – All 12 subject textbooks available offline with built-in PDF viewer and content finder' },
                      { icon: Users, text: 'Student Directory – Browse all 98 students with search and filter by section and gender' },
                      { icon: ClipboardList, text: 'Mid Exam Results – View mid-term examination results with answer keys' },
                      { icon: FileCheck, text: 'Final Exam Results – Access final examination results' },
                      { icon: FileText, text: 'Report Card – View your academic report card by entering your student ID' },
                      { icon: Award, text: 'Ministry Results – Check official ministry examination results' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <feature.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">🏫 School</h3>
                  <p className="text-xs text-muted-foreground">St. Theresa School – Grade 9</p>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">👨‍💻 Developer</h3>
                  <p className="text-xs text-muted-foreground">Created by hubproman</p>
                  <p className="text-xs text-muted-foreground mt-1">Built with ❤️ for students</p>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">📌 Version</h3>
                  <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'help' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-bold text-foreground mb-3">Help</h2>
              <div className="bg-card rounded-2xl p-4 border border-border mb-3">
                <p className="text-xs text-muted-foreground mb-3">
                  Need help? Type your message below and send it. We'll get back to you through our Telegram channel.
                </p>
                <div className="space-y-2">
                  <textarea
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 rounded-xl bg-muted border border-border text-sm resize-none h-28 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!helpMessage.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 active:opacity-80 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                  {messageSent && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-500 text-center"
                    >
                      ✓ Message sent! We'll respond soon.
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">hubproman</h3>
                    <p className="text-xs text-muted-foreground">Developer & Admin</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://t.me/grade9studentstschannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted active:bg-accent transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-sky-500" />
                    <span className="text-xs text-foreground flex-1">Telegram Channel</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                  <a
                    href="https://t.me/grade9studentsts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted active:bg-accent transition-colors"
                  >
                    <Users className="w-4 h-4 text-violet-500" />
                    <span className="text-xs text-foreground flex-1">Telegram Group</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 px-4"
    >
      <div className="max-w-lg mx-auto">
        <div className="py-4 mb-2">
          <h1 className="text-xl font-bold text-foreground">Info</h1>
          <p className="text-muted-foreground text-xs mt-0.5">About, help & contact</p>
        </div>

        <div className="space-y-1.5">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.external) {
                  window.open(item.external, '_blank');
                } else {
                  setActiveSection(item.key);
                }
              }}
              className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border active:bg-muted transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              {item.external ? (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPage;
