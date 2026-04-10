import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// Ministry IDs 219335 - 219451 mapped to student IDs 1-98
// This is a placeholder since we don't have actual ministry result data in the DB
const MINISTRY_ID_START = 219335;
const MINISTRY_ID_END = 219451;

const MinistryResults = () => {
  const [searchId, setSearchId] = useState('');

  const results: { ministryId: number; studentId: number }[] = [];
  for (let i = 0; i <= MINISTRY_ID_END - MINISTRY_ID_START; i++) {
    results.push({ ministryId: MINISTRY_ID_START + i, studentId: i + 1 });
  }

  const filtered = searchId
    ? results.filter((r) => r.ministryId.toString().includes(searchId))
    : results;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Ministry Results</h2>
        <p className="text-muted-foreground text-sm">Ministry IDs: 219335 – 219451</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search by Ministry ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-ring outline-none text-sm"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-border font-semibold text-sm">
          <div className="bg-muted px-4 py-3">Ministry ID</div>
          <div className="bg-muted px-4 py-3">Student ID</div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filtered.slice(0, 50).map((r, i) => (
            <motion.div
              key={r.ministryId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className="grid grid-cols-2 gap-px bg-border text-sm"
            >
              <div className="bg-card px-4 py-2.5">{r.ministryId}</div>
              <div className="bg-card px-4 py-2.5">{r.studentId}</div>
            </motion.div>
          ))}
        </div>
        {filtered.length > 50 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Showing 50 of {filtered.length} results
          </p>
        )}
      </div>
    </div>
  );
};

export default MinistryResults;
