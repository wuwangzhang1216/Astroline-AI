import React from 'react';

// --- Icons (SVG) ---
export const Icons = {
  Female: () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0v-6m0 0h-3m3 0h3" /></svg>,
  Male: () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9a3 3 0 100-6 3 3 0 000 6zm5.293 2.293l-5.293 5.293-5.293-5.293" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21l3-3m-3 3l-3-3" /></svg>, // Simplified representation
  Genderless: () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
  Heart: () => <span className="text-xl">❤️</span>,
  BrokenHeart: () => <span className="text-xl">💔</span>,
  Ring: () => <span className="text-xl">💍</span>,
  Star: () => <span className="text-xl">💫</span>,
  Smile: () => <span className="text-xl">😌</span>,
  Briefcase: () => <span className="text-xl">💼</span>,
  Plane: () => <span className="text-xl">🌍</span>,
  Book: () => <span className="text-xl">🎓</span>,
  Baby: () => <span className="text-xl">🤱</span>,
  Users: () => <span className="text-xl">👥</span>,
  Leaf: () => <span className="text-xl">🍃</span>,
  Fire: () => <span className="text-xl">🔥</span>,
  Water: () => <span className="text-xl">🌊</span>,
  Wind: () => <span className="text-xl">🌪️</span>,
  Back: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
};

// --- Components ---

interface HeaderProps {
  onBack: () => void;
  step: number;
  totalSteps: number;
}

export const Header: React.FC<HeaderProps> = ({ onBack, step, totalSteps }) => (
  <div className="flex flex-col w-full bg-[#0d1f2d] sticky top-0 z-50 pt-2 pb-2">
    <div className="flex items-center justify-between px-4 h-12">
      <button onClick={onBack} className="text-white opacity-80 hover:opacity-100 transition-opacity">
        <Icons.Back />
      </button>
      <h1 className="text-lg font-serif tracking-wide text-[#e2e8f0]">Astroline</h1>
      <span className="text-xs font-mono text-gray-400">{step}/{totalSteps}</span>
    </div>
    {/* Progress Bar */}
    <div className="h-1 w-full bg-[#1e293b]">
      <div 
        className="h-full bg-gradient-to-r from-teal-600 to-teal-300 transition-all duration-500 ease-out" 
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);

interface PrimaryButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 rounded-full font-medium text-lg shadow-lg transition-all transform active:scale-95 ${
      disabled 
        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
        : 'bg-gradient-to-r from-teal-500 to-teal-400 text-[#0f172a] hover:brightness-110'
    } ${className}`}
  >
    {children}
  </button>
);

interface SelectionCardProps {
  onClick: () => void;
  selected: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ onClick, selected, children, icon }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center p-4 mb-3 rounded-xl cursor-pointer transition-all border
      ${selected 
        ? 'bg-teal-900/40 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
        : 'bg-[#162B36] border-transparent hover:bg-[#1c3542]'}
    `}
  >
    {icon && <div className="mr-4">{icon}</div>}
    <span className={`text-lg ${selected ? 'text-teal-200' : 'text-gray-200'}`}>{children}</span>
  </div>
);

interface OptionGridProps {
  children?: React.ReactNode;
}

export const OptionGrid: React.FC<OptionGridProps> = ({ children }) => (
  <div className="grid grid-cols-1 gap-3 w-full">
    {children}
  </div>
);

interface TitleProps {
  children?: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h2 className="text-3xl serif text-center mb-2 text-[#eef2f6] leading-tight mt-4">
    {children}
  </h2>
);

interface SubtitleProps {
  children?: React.ReactNode;
}

export const Subtitle: React.FC<SubtitleProps> = ({ children }) => (
  <p className="text-center text-gray-400 text-sm mb-8 px-4 leading-relaxed">
    {children}
  </p>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => (
  <input 
    {...props}
    className="w-full bg-[#162B36] border border-gray-700 rounded-lg p-4 text-white text-center text-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-gray-500"
  />
);