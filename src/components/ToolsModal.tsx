// Modal hosting the in-app tools: calculator, periodic table, AI chat.
import { useState } from 'react';
import { X, Calculator, FlaskConical, Sparkles } from 'lucide-react';
import CalculatorTool from './tools/CalculatorTool';
import PeriodicTableTool from './tools/PeriodicTableTool';
import AiChatTool from './tools/AiChatTool';

interface Props { onClose: () => void; }

type Tab = 'calc' | 'periodic' | 'ai';

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'calc', label: 'Calculator', icon: Calculator },
  { id: 'periodic', label: 'Periodic', icon: FlaskConical },
  { id: 'ai', label: 'AI Tutor', icon: Sparkles },
];

const ToolsModal = ({ onClose }: Props) => {
  const [tab, setTab] = useState<Tab>('calc');

  return (
    <div className="fixed inset-0 z-[120] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <p className="text-sm font-semibold">Tools</p>
          <button onClick={onClose} className="p-2 rounded-lg active:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 p-2 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium ${
                tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground active:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'calc' && <CalculatorTool />}
          {tab === 'periodic' && <PeriodicTableTool />}
          {tab === 'ai' && <AiChatTool />}
        </div>
      </div>
    </div>
  );
};

export default ToolsModal;
