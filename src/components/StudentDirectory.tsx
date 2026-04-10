import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Student, Section, Gender } from '@/types/student';

const StudentDirectory = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section>('All');
  const [gender, setGender] = useState<Gender>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data } = await supabase.from('students').select('*').order('english_name');
      if (data) setStudents(data);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.english_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.toLowerCase());
    const matchSection = section === 'All' || s.section === section;
    const matchGender = gender === 'All' || s.gender === gender;
    return matchSearch && matchSection && matchGender;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Student Directory</h2>
        <p className="text-muted-foreground text-sm">98 students across sections 9A, 9B, and 9C</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-ring outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as Section)}
            className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-ring outline-none"
          >
            <option value="All">All Sections</option>
            <option value="9A">9A</option>
            <option value="9B">9B</option>
            <option value="9C">9C</option>
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-ring outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </motion.div>

      <p className="text-sm text-muted-foreground">
        <Filter size={14} className="inline mr-1" />
        Showing {filtered.length} of {students.length} students
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                {student.image_url ? (
                  <img src={student.image_url} alt={student.english_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl font-bold">
                    {student.english_name?.[0]}
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-center truncate">{student.english_name}</h3>
              <p className="text-xs text-muted-foreground text-center">{student.name}</p>
              <div className="flex justify-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {student.section}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  #{student.id}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
