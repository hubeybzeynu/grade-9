import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Eye } from 'lucide-react';
import { externalSupabase } from '@/lib/supabase';
import type { ExamResult } from '@/types/student';

interface ExamResultsProps {
  type: 'mid' | 'final';
}

const ExamResults = ({ type }: ExamResultsProps) => {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tableName = type === 'mid' ? 'mid_results' : 'final_results';
  const title = type === 'mid' ? 'Mid Exam Results' : 'Final Exam Results';

  const handleSearch = async () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    setResult(null);

    const { data, error: err } = await externalSupabase
      .from(tableName)
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (err || !data) {
      setError('No results found for this student ID.');
    } else {
      setResult(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm">Enter your student ID (1-98) to view results</p>
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

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm">
          {error}
        </motion.p>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-1">{result.student_name}</h3>
            <p className="text-xs text-muted-foreground mb-4">Student ID: {result.student_id}</p>

            {result.result_image_url && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Eye size={16} /> Result
                </p>
                <img
                  src={result.result_image_url}
                  alt="Result"
                  className="w-full rounded-xl border border-border"
                />
              </div>
            )}

            {result.answer_image_url && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Eye size={16} /> Answer Sheet
                </p>
                <img
                  src={result.answer_image_url}
                  alt="Answer"
                  className="w-full rounded-xl border border-border"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExamResults;
