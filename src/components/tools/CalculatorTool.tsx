import { useState } from 'react';
import { evaluate } from 'mathjs';
import { Delete } from 'lucide-react';

type Mode = 'sci' | 'chem';

// Atomic masses for the most common elements (g/mol)
const ATOMIC_MASS: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.085,
  P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Fe: 55.845,
  Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.87, I: 126.9, Au: 196.97, Hg: 200.59,
  Pb: 207.2, Mn: 54.938, Ni: 58.693, Co: 58.933, Cr: 51.996, Sn: 118.71,
};

function parseFormula(formula: string): Array<{ symbol: string; count: number; mass: number }> {
  const re = /([A-Z][a-z]?)(\d*)|\(([^()]+)\)(\d*)/g;
  const out: Record<string, number> = {};
  let m: RegExpExecArray | null;
  while ((m = re.exec(formula)) !== null) {
    if (m[1]) {
      const sym = m[1];
      const n = m[2] ? parseInt(m[2], 10) : 1;
      out[sym] = (out[sym] || 0) + n;
    } else if (m[3]) {
      const inner = parseFormula(m[3]);
      const mult = m[4] ? parseInt(m[4], 10) : 1;
      for (const part of inner) out[part.symbol] = (out[part.symbol] || 0) + part.count * mult;
    }
  }
  return Object.entries(out).map(([symbol, count]) => {
    const mass = ATOMIC_MASS[symbol];
    if (mass === undefined) throw new Error(`Unknown element: ${symbol}`);
    return { symbol, count, mass };
  });
}

const CalculatorTool = () => {
  const [mode, setMode] = useState<Mode>('sci');
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [formula, setFormula] = useState('H2O');

  const safeEval = (s: string) => {
    try {
      const opens = (s.match(/\(/g) || []).length;
      const closes = (s.match(/\)/g) || []).length;
      const balanced = s + ')'.repeat(Math.max(0, opens - closes));
      const r = evaluate(balanced);
      setResult(typeof r === 'number' ? Number(r.toPrecision(12)).toString() : String(r));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setResult('');
    }
  };

  const append = (t: string) => setExpr((p) => p + t);
  const clear = () => { setExpr(''); setResult(''); setError(''); };
  const backspace = () => setExpr((p) => p.slice(0, -1));

  const keys: Array<{ label: React.ReactNode; value?: string; action?: () => void; variant?: 'op' | 'fn' | 'eq' }> = [
    { label: 'AC', action: clear, variant: 'op' },
    { label: '( )', value: '()', variant: 'op' },
    { label: '%', value: '%', variant: 'op' },
    { label: '÷', value: '/', variant: 'op' },
    { label: 'sin', value: 'sin(', variant: 'fn' },
    { label: 'cos', value: 'cos(', variant: 'fn' },
    { label: 'tan', value: 'tan(', variant: 'fn' },
    { label: '×', value: '*', variant: 'op' },
    { label: 'ln', value: 'log(', variant: 'fn' },
    { label: 'log', value: 'log10(', variant: 'fn' },
    { label: '√', action: () => append('sqrt('), variant: 'fn' },
    { label: '−', value: '-', variant: 'op' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: '^', value: '^', variant: 'op' },
    { label: '+', value: '+', variant: 'op' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' },
    { label: '!', value: '!', variant: 'op' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' },
    { label: 'x', value: 'x' },
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
    { label: '⌫', action: backspace, variant: 'op' },
    { label: '0', value: '0' }, { label: '.', value: '.' },
    { label: '+/-', action: () => setExpr((p) => p.startsWith('-') ? p.slice(1) : '-' + p) },
    { label: '=', action: () => safeEval(expr), variant: 'eq' },
  ];

  let chemResult: { mass: number; parts: ReturnType<typeof parseFormula> } | null = null;
  let chemError = '';
  try { const parts = parseFormula(formula); chemResult = { parts, mass: parts.reduce((s, p) => s + p.mass * p.count, 0) }; }
  catch (e) { chemError = (e as Error).message; }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-1 bg-muted rounded-xl p-1 text-xs">
        {([['sci', 'Scientific'], ['chem', 'Chemistry']] as [Mode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 px-2 py-1.5 rounded-lg font-medium ${mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >{label}</button>
        ))}
      </div>

      {mode === 'sci' && (
        <div className="space-y-3">
          <div className="bg-muted rounded-xl p-3 min-h-[88px] flex flex-col justify-end">
            <p className="text-xs text-muted-foreground break-all">{expr || '\u00A0'}</p>
            <p className="text-2xl font-mono font-bold break-all">
              {error ? <span className="text-destructive text-sm">{error}</span> : result || '0'}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {keys.map((k, i) => (
              <button
                key={i}
                onClick={() => {
                  if (k.action) k.action();
                  else if (k.value) {
                    if (k.value === '()') {
                      const opens = (expr.match(/\(/g) || []).length;
                      const closes = (expr.match(/\)/g) || []).length;
                      append(opens > closes ? ')' : '(');
                    } else append(k.value);
                  }
                }}
                className={`py-3 rounded-lg text-sm font-semibold active:opacity-70 ${
                  k.variant === 'eq' ? 'bg-primary text-primary-foreground'
                  : k.variant === 'op' ? 'bg-accent text-accent-foreground'
                  : k.variant === 'fn' ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-foreground'
                }`}
              >
                {k.label === '⌫' ? <Delete className="w-4 h-4 mx-auto" /> : k.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'chem' && (
        <div className="space-y-3">
          <label className="flex flex-col text-xs gap-1">
            <span className="text-muted-foreground">Chemical formula</span>
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. H2O, C6H12O6, Ca(OH)2"
            />
          </label>
          {chemResult ? (
            <div className="bg-muted rounded-xl p-3 space-y-2">
              <p className="text-sm">Molar mass: <b className="text-primary">{chemResult.mass.toFixed(3)} g/mol</b></p>
              <div className="flex flex-wrap gap-1.5">
                {chemResult.parts.map((p, i) => (
                  <span key={i} className="px-2 py-1 rounded-md bg-background text-xs font-mono">
                    {p.symbol}<sub>{p.count}</sub> → {(p.mass * p.count).toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          ) : <p className="text-xs text-destructive">{chemError}</p>}
        </div>
      )}
    </div>
  );
};

export default CalculatorTool;
