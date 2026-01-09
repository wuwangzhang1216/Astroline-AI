import React from 'react';

// --- Icons (SVG) ---
export const Icons = {
  Female: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0v-6m0 0h-3m3 0h3" /></svg>,
  Male: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 9a3 3 0 100-6 3 3 0 000 6zm5.293 2.293l-5.293 5.293-5.293-5.293" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 21l3-3m-3 3l-3-3" /></svg>,
  Genderless: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 4v16m8-8H4" /></svg>,
  Heart: () => <span className="text-lg filter drop-shadow-md">❤️</span>,
  BrokenHeart: () => <span className="text-lg filter drop-shadow-md">💔</span>,
  Ring: () => <span className="text-lg filter drop-shadow-md">💍</span>,
  Star: () => <span className="text-lg filter drop-shadow-md">✨</span>,
  Smile: () => <span className="text-lg filter drop-shadow-md">😌</span>,
  Briefcase: () => <span className="text-lg filter drop-shadow-md">💼</span>,
  Plane: () => <span className="text-lg filter drop-shadow-md">🌍</span>,
  Book: () => <span className="text-lg filter drop-shadow-md">🎓</span>,
  Baby: () => <span className="text-lg filter drop-shadow-md">🤱</span>,
  Users: () => <span className="text-lg filter drop-shadow-md">👥</span>,
  Leaf: () => <span className="text-lg filter drop-shadow-md">🍃</span>,
  Fire: () => <span className="text-lg filter drop-shadow-md">🔥</span>,
  Water: () => <span className="text-lg filter drop-shadow-md">🌊</span>,
  Wind: () => <span className="text-lg filter drop-shadow-md">🌪️</span>,
  Back: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>,
  Camera: () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214L13 3z" /></svg>
};

// --- Components ---

interface HeaderProps {
  onBack: () => void;
  step: number;
  totalSteps: number;
}

export const Header: React.FC<HeaderProps> = ({ onBack, step, totalSteps }) => {
    const progress = Math.min(100, Math.round((step / totalSteps) * 100));
    return (
        <div className="flex flex-col w-full shrink-0 z-50 pt-safe bg-[#050B14]/90 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center justify-between px-4 h-14">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-white/10 text-teal-400 hover:text-teal-300 transition-colors">
                    <Icons.Back />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-serif tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white uppercase">Astroline AI</span>
                </div>
                <div className="w-10 text-right text-[9px] font-mono text-teal-500/80">{progress}%</div>
            </div>
            {/* Ultra-thin Progress Bar */}
            <div className="h-[1px] w-full bg-white/5 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-teal-600 via-cyan-400 to-teal-200 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(45,212,191,0.8)]" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

interface PrimaryButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, disabled = false, className = '', loading = false }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      w-full py-4 rounded-xl font-medium text-base tracking-wide shadow-lg relative overflow-hidden group
      transition-all duration-200 active:scale-[0.98] 
      flex items-center justify-center
      ${disabled || loading
        ? 'bg-gray-800/40 text-gray-600 cursor-not-allowed border border-white/5' 
        : 'bg-gradient-to-r from-teal-800 to-cyan-800 text-white border border-teal-500/30 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]'
      } ${className}`}
  >
    {!disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    )}
    
    <span className="relative z-10 flex items-center gap-2">
    {loading ? (
      <>
         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
         <span className="text-xs uppercase tracking-widest">Processing</span>
      </>
    ) : children}
    </span>
  </button>
);

interface SelectionCardProps {
  onClick: () => void;
  selected: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ onClick, selected, children, icon }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border text-left
      glass-panel mb-2
      ${selected 
        ? 'bg-teal-900/40 border-teal-500/60 shadow-[0_0_15px_rgba(45,212,191,0.15)]' 
        : 'hover:bg-white/5 hover:border-white/20 active:bg-white/10'}
    `}
  >
    {icon && (
        <div className={`mr-4 transition-transform duration-300 ${selected ? 'scale-110 text-teal-300' : 'text-gray-400'}`}>
            {icon}
        </div>
    )}
    <span className={`text-base font-light tracking-wide flex-1 ${selected ? 'text-white' : 'text-gray-300'}`}>{children}</span>
    {selected && <div className="text-teal-400 animate-fade-in"><Icons.Check /></div>}
  </button>
);

interface OptionGridProps {
  children?: React.ReactNode;
}

export const OptionGrid: React.FC<OptionGridProps> = ({ children }) => (
  <div className="grid grid-cols-1 w-full animate-slide-up">
    {children}
  </div>
);

interface TitleProps {
  children?: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h2 className="text-3xl serif text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 leading-tight mt-4 drop-shadow-sm tracking-tight">
    {children}
  </h2>
);

interface SubtitleProps {
  children?: React.ReactNode;
}

export const Subtitle: React.FC<SubtitleProps> = ({ children }) => (
  <p className="text-center text-gray-400 text-sm mb-8 px-4 leading-relaxed font-light font-mystic tracking-wide">
    {children}
  </p>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => (
  <div className="relative group w-full">
    <input 
      {...props}
      className="w-full bg-[#0E1621] border border-gray-700/50 rounded-xl p-4 text-white text-center text-lg focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-900/50 transition-all placeholder-gray-600 shadow-inner"
    />
  </div>
);

// New component for Layout
export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-full overflow-hidden w-full relative">
    {children}
  </div>
);

export const ContentArea: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto scrollbar-hide w-full px-6 py-2 ${className}`}>
    {children}
  </div>
);

export const ActionArea: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`shrink-0 p-6 pb-safe w-full bg-gradient-to-t from-[#050B14] via-[#050B14] to-transparent z-10 ${className}`}>
    {children}
  </div>
);
