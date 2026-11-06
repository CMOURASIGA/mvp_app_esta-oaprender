import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  inverted = false,
}) => {
  const containerHeights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Colégio Estação do Aprender Logo Image */}
      <div className={`relative flex items-center justify-center rounded-lg p-0.5 bg-white ${containerHeights[size]}`}>
        <img
          src="/logo_estacao.png"
          alt="Colégio Estação do Aprender - Bilingual School"
          className="h-full w-auto object-contain shrink-0"
          loading="eager"
        />
      </div>

      {showSubtitle && (
        <div className="hidden sm:flex flex-col leading-none border-l border-slate-200/80 pl-2.5 py-0.5">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase ${
              inverted ? 'text-teal-200' : 'text-slate-800'
            }`}
          >
            Niterói · RJ
          </span>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 ${
              inverted ? 'text-teal-100/70' : 'text-slate-500'
            }`}
          >
            Gestão & Família
          </span>
        </div>
      )}
    </div>
  );
};
