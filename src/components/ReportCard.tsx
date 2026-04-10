import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Award, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ReportCard as ReportCardType } from '@/types/student';

const ReportCard = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [card, setCard] = useState<ReportCardType | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [pendingCard, setPendingCard] = useState<ReportCardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    setCard(null);
    setNeedsPassword(false);

    const { data, error: err } = await supabase
      .from('report_cards')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (err || !data) {
      setError('No report card found for this student ID.');
    } else if (data.card_password) {
      setPendingCard(data);
      setNeedsPassword(true);
    } else {
      setCard(data);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = () => {
    if (pendingCard && password === pendingCard.card_password) {
      setCard(pendingCard);
      setNeedsPassword(false);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  const subjects = card?.subjects ? (typeof card.subjects === 'string' ? JSON.parse(card.subjects) : card.subjects) : null;
  const conduct = card?.conduct ? (typeof card.conduct === 'string' ? JSON.parse(card.conduct) : card.conduct) : null;
  const rank = card?.rank ? (typeof card.rank === 'string' ? JSON.parse(card.rank) : card.rank) : null;
  const isPromoted = !!card?.promoted_to;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Report Card</h2>
        <p className="text-muted-foreground text-sm">View your full academic report</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 max-w-md"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="number"
            min="1"
            max="98"
            placeholder="Student ID (1-98)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-ring outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </motion.div>

      {needsPassword && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md space-y-3">
          <p className="text-sm flex items-center gap-2 text-muted-foreground">
            <Lock size={16} /> This report card is password protected
          </p>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-ring outline-none text-sm"
            />
            <button
              onClick={handlePasswordSubmit}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
            >
              Unlock
            </button>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm">
          {error}
        </motion.p>
      )}

      {card && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-[hsl(270,60%,55%)] p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{card.student_name}</h3>
                <p className="text-sm opacity-80">Grade {card.grade} • ID: {card.student_id}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                isPromoted ? 'bg-white/20' : 'bg-red-500/30'
              }`}>
                {isPromoted ? (
                  <span className="flex items-center gap-1"><CheckCircle size={14} /> Promoted</span>
                ) : (
                  <span className="flex items-center gap-1"><XCircle size={14} /> Detained</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Rank */}
            {rank && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                <Award className="text-primary" size={24} />
                <div>
                  <p className="text-sm font-semibold">Section Rank</p>
                  <p className="text-xs text-muted-foreground">
                    {typeof rank === 'object' ? JSON.stringify(rank) : rank} out of {card.total_students}
                  </p>
                </div>
              </div>
            )}

            {/* Subjects */}
            {subjects && Array.isArray(subjects) && (
              <div>
                <h4 className="font-semibold mb-3">Subjects</h4>
                <div className="space-y-2">
                  {subjects.map((subj: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted text-sm">
                      <span className="font-medium">{subj.name || subj.subject}</span>
                      <span className={`font-semibold ${
                        (subj.average || subj.total || 0) < 60 ? 'text-destructive' : 'text-foreground'
                      }`}>
                        {subj.average || subj.total || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance */}
            {(card.days_present != null || card.days_absent != null) && (
              <div>
                <h4 className="font-semibold mb-3">Attendance</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted text-center">
                    <p className="text-2xl font-bold text-primary">{card.days_present ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">Days Present</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted text-center">
                    <p className="text-2xl font-bold text-destructive">{card.days_absent ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">Days Absent</p>
                  </div>
                </div>
              </div>
            )}

            {/* Conduct */}
            {conduct && (
              <div>
                <h4 className="font-semibold mb-3">Conduct</h4>
                <div className="p-3 rounded-xl bg-muted text-sm">
                  {typeof conduct === 'object' ? JSON.stringify(conduct) : conduct}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportCard;
