// Compact periodic table — clickable cells show element details.
import { useState } from 'react';

interface El {
  n: number;        // atomic number
  s: string;        // symbol
  name: string;
  m: number;        // atomic mass
  c: number;        // category index (color)
  r: number;        // row (1..7)
  col: number;      // column (1..18)
}

const CATEGORY_COLORS = [
  'bg-rose-500/80',     // 0 nonmetal
  'bg-amber-500/80',    // 1 alkali
  'bg-orange-500/80',   // 2 alkaline earth
  'bg-emerald-500/80',  // 3 transition
  'bg-cyan-500/80',     // 4 post-transition
  'bg-sky-500/80',      // 5 metalloid
  'bg-violet-500/80',   // 6 halogen
  'bg-fuchsia-500/80',  // 7 noble gas
  'bg-slate-500/80',    // 8 lanthanide/actinide
];
const CATEGORY_NAMES = ['Nonmetal','Alkali metal','Alkaline earth','Transition metal','Post-transition','Metalloid','Halogen','Noble gas','Lanthanide/Actinide'];

const E: El[] = [
  { n:1,s:'H',name:'Hydrogen',m:1.008,c:0,r:1,col:1 },
  { n:2,s:'He',name:'Helium',m:4.0026,c:7,r:1,col:18 },
  { n:3,s:'Li',name:'Lithium',m:6.94,c:1,r:2,col:1 },
  { n:4,s:'Be',name:'Beryllium',m:9.0122,c:2,r:2,col:2 },
  { n:5,s:'B',name:'Boron',m:10.81,c:5,r:2,col:13 },
  { n:6,s:'C',name:'Carbon',m:12.011,c:0,r:2,col:14 },
  { n:7,s:'N',name:'Nitrogen',m:14.007,c:0,r:2,col:15 },
  { n:8,s:'O',name:'Oxygen',m:15.999,c:0,r:2,col:16 },
  { n:9,s:'F',name:'Fluorine',m:18.998,c:6,r:2,col:17 },
  { n:10,s:'Ne',name:'Neon',m:20.18,c:7,r:2,col:18 },
  { n:11,s:'Na',name:'Sodium',m:22.99,c:1,r:3,col:1 },
  { n:12,s:'Mg',name:'Magnesium',m:24.305,c:2,r:3,col:2 },
  { n:13,s:'Al',name:'Aluminum',m:26.982,c:4,r:3,col:13 },
  { n:14,s:'Si',name:'Silicon',m:28.085,c:5,r:3,col:14 },
  { n:15,s:'P',name:'Phosphorus',m:30.974,c:0,r:3,col:15 },
  { n:16,s:'S',name:'Sulfur',m:32.06,c:0,r:3,col:16 },
  { n:17,s:'Cl',name:'Chlorine',m:35.45,c:6,r:3,col:17 },
  { n:18,s:'Ar',name:'Argon',m:39.948,c:7,r:3,col:18 },
  { n:19,s:'K',name:'Potassium',m:39.098,c:1,r:4,col:1 },
  { n:20,s:'Ca',name:'Calcium',m:40.078,c:2,r:4,col:2 },
  { n:21,s:'Sc',name:'Scandium',m:44.956,c:3,r:4,col:3 },
  { n:22,s:'Ti',name:'Titanium',m:47.867,c:3,r:4,col:4 },
  { n:23,s:'V',name:'Vanadium',m:50.942,c:3,r:4,col:5 },
  { n:24,s:'Cr',name:'Chromium',m:51.996,c:3,r:4,col:6 },
  { n:25,s:'Mn',name:'Manganese',m:54.938,c:3,r:4,col:7 },
  { n:26,s:'Fe',name:'Iron',m:55.845,c:3,r:4,col:8 },
  { n:27,s:'Co',name:'Cobalt',m:58.933,c:3,r:4,col:9 },
  { n:28,s:'Ni',name:'Nickel',m:58.693,c:3,r:4,col:10 },
  { n:29,s:'Cu',name:'Copper',m:63.546,c:3,r:4,col:11 },
  { n:30,s:'Zn',name:'Zinc',m:65.38,c:3,r:4,col:12 },
  { n:31,s:'Ga',name:'Gallium',m:69.723,c:4,r:4,col:13 },
  { n:32,s:'Ge',name:'Germanium',m:72.63,c:5,r:4,col:14 },
  { n:33,s:'As',name:'Arsenic',m:74.922,c:5,r:4,col:15 },
  { n:34,s:'Se',name:'Selenium',m:78.971,c:0,r:4,col:16 },
  { n:35,s:'Br',name:'Bromine',m:79.904,c:6,r:4,col:17 },
  { n:36,s:'Kr',name:'Krypton',m:83.798,c:7,r:4,col:18 },
  { n:37,s:'Rb',name:'Rubidium',m:85.468,c:1,r:5,col:1 },
  { n:38,s:'Sr',name:'Strontium',m:87.62,c:2,r:5,col:2 },
  { n:39,s:'Y',name:'Yttrium',m:88.906,c:3,r:5,col:3 },
  { n:40,s:'Zr',name:'Zirconium',m:91.224,c:3,r:5,col:4 },
  { n:41,s:'Nb',name:'Niobium',m:92.906,c:3,r:5,col:5 },
  { n:42,s:'Mo',name:'Molybdenum',m:95.95,c:3,r:5,col:6 },
  { n:43,s:'Tc',name:'Technetium',m:98,c:3,r:5,col:7 },
  { n:44,s:'Ru',name:'Ruthenium',m:101.07,c:3,r:5,col:8 },
  { n:45,s:'Rh',name:'Rhodium',m:102.91,c:3,r:5,col:9 },
  { n:46,s:'Pd',name:'Palladium',m:106.42,c:3,r:5,col:10 },
  { n:47,s:'Ag',name:'Silver',m:107.87,c:3,r:5,col:11 },
  { n:48,s:'Cd',name:'Cadmium',m:112.41,c:3,r:5,col:12 },
  { n:49,s:'In',name:'Indium',m:114.82,c:4,r:5,col:13 },
  { n:50,s:'Sn',name:'Tin',m:118.71,c:4,r:5,col:14 },
  { n:51,s:'Sb',name:'Antimony',m:121.76,c:5,r:5,col:15 },
  { n:52,s:'Te',name:'Tellurium',m:127.6,c:5,r:5,col:16 },
  { n:53,s:'I',name:'Iodine',m:126.9,c:6,r:5,col:17 },
  { n:54,s:'Xe',name:'Xenon',m:131.29,c:7,r:5,col:18 },
  { n:55,s:'Cs',name:'Cesium',m:132.91,c:1,r:6,col:1 },
  { n:56,s:'Ba',name:'Barium',m:137.33,c:2,r:6,col:2 },
  { n:72,s:'Hf',name:'Hafnium',m:178.49,c:3,r:6,col:4 },
  { n:73,s:'Ta',name:'Tantalum',m:180.95,c:3,r:6,col:5 },
  { n:74,s:'W',name:'Tungsten',m:183.84,c:3,r:6,col:6 },
  { n:75,s:'Re',name:'Rhenium',m:186.21,c:3,r:6,col:7 },
  { n:76,s:'Os',name:'Osmium',m:190.23,c:3,r:6,col:8 },
  { n:77,s:'Ir',name:'Iridium',m:192.22,c:3,r:6,col:9 },
  { n:78,s:'Pt',name:'Platinum',m:195.08,c:3,r:6,col:10 },
  { n:79,s:'Au',name:'Gold',m:196.97,c:3,r:6,col:11 },
  { n:80,s:'Hg',name:'Mercury',m:200.59,c:3,r:6,col:12 },
  { n:81,s:'Tl',name:'Thallium',m:204.38,c:4,r:6,col:13 },
  { n:82,s:'Pb',name:'Lead',m:207.2,c:4,r:6,col:14 },
  { n:83,s:'Bi',name:'Bismuth',m:208.98,c:4,r:6,col:15 },
];

const PeriodicTableTool = () => {
  const [sel, setSel] = useState<El | null>(null);
  return (
    <div className="p-3 space-y-3">
      <div className="overflow-x-auto">
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(18, minmax(28px, 1fr))', minWidth: 540 }}>
          {Array.from({ length: 7 * 18 }).map((_, idx) => {
            const r = Math.floor(idx / 18) + 1;
            const c = (idx % 18) + 1;
            const el = E.find(e => e.r === r && e.col === c);
            if (!el) return <div key={idx} className="aspect-square" />;
            return (
              <button
                key={idx}
                onClick={() => setSel(el)}
                className={`aspect-square rounded-[4px] flex flex-col items-center justify-center text-[8px] font-bold text-white active:scale-95 transition ${CATEGORY_COLORS[el.c]} ${sel?.n === el.n ? 'ring-2 ring-white' : ''}`}
              >
                <span className="text-[7px] opacity-80">{el.n}</span>
                <span className="text-[10px] leading-none">{el.s}</span>
              </button>
            );
          })}
        </div>
      </div>

      {sel ? (
        <div className="bg-muted rounded-xl p-3 space-y-1">
          <p className="text-lg font-bold">{sel.s} <span className="text-sm text-muted-foreground">— {sel.name}</span></p>
          <p className="text-xs">Atomic number: <b>{sel.n}</b></p>
          <p className="text-xs">Atomic mass: <b>{sel.m} g/mol</b></p>
          <p className="text-xs">Category: <b>{CATEGORY_NAMES[sel.c]}</b></p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center">Tap any element to see details.</p>
      )}

      <div className="grid grid-cols-3 gap-1 text-[9px]">
        {CATEGORY_NAMES.map((n, i) => (
          <div key={n} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded ${CATEGORY_COLORS[i]}`} />
            <span className="text-muted-foreground">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTableTool;
