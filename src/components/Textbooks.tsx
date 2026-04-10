import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

const textbooks = [
  { title: 'Mathematics', file: 'G9-Mathematics-STB-2023-web.pdf', color: 'from-blue-500 to-blue-700' },
  { title: 'Biology', file: 'G9-Biology-STB-2023-web.pdf', color: 'from-green-500 to-green-700' },
  { title: 'Chemistry', file: 'G9-Chemistry-STB-2023-web.pdf', color: 'from-purple-500 to-purple-700' },
  { title: 'Economics', file: 'G9-Economics-STB-2023-web.pdf', color: 'from-amber-500 to-amber-700' },
  { title: 'HPE', file: 'GRADE_9-HPE.pdf', color: 'from-red-500 to-red-700' },
  { title: 'Amharic', file: 'amharic_grade_9.pdf', color: 'from-teal-500 to-teal-700' },
];

const Textbooks = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Textbooks</h2>
        <p className="text-muted-foreground text-sm">Grade 9 textbooks for 6 subjects</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {textbooks.map((book, i) => (
          <motion.a
            key={book.file}
            href={`https://grade9sts.lovable.app/textbooks/${book.file}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className={`h-32 bg-gradient-to-br ${book.color} flex items-center justify-center`}>
              <BookOpen size={48} className="text-white/80 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-xs text-muted-foreground">PDF Textbook</p>
              </div>
              <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default Textbooks;
