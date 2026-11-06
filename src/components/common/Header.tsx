import React from 'react';
import { useSchool, ActiveModule } from '../../context/SchoolContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  ShieldCheck,
  Users,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    activeResponsavel,
    setActiveResponsavel,
    responsaveis,
    activeAluno,
    setActiveAluno,
    alunosVinculados,
  } = useSchool();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo size="md" />
        </div>

        {/* Zone 2: Clear Navigation Switcher between Gestão & Família (SPEC B1) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-inner">
          <button
            onClick={() => setActiveModule('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck
              className={`w-4 h-4 ${
                activeModule === 'admin' ? 'text-teal-700' : 'text-slate-400'
              }`}
              style={{ color: activeModule === 'admin' ? '#0E4D5C' : undefined }}
            />
            <span>Painel Administrativo</span>
          </button>

          <button
            onClick={() => setActiveModule('family')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeModule === 'family'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users
              className={`w-4 h-4 ${
                activeModule === 'family' ? 'text-coral-600' : 'text-slate-400'
              }`}
              style={{ color: activeModule === 'family' ? '#F27059' : undefined }}
            />
            <span>Portal da Família</span>
          </button>
        </div>

        {/* Zone 3: Active Profile Selector or Family Student Switcher + PWA Button */}
        <div className="flex items-center gap-3 shrink-0">
          {activeModule === 'family' ? (
            <div className="flex items-center gap-2">
              {/* Family Parent switcher */}
              <div className="relative group">
                <select
                  value={activeResponsavel?.id || ''}
                  onChange={(e) => {
                    const found = responsaveis.find((r) => r.id === e.target.value);
                    if (found) setActiveResponsavel(found);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-teal-600"
                  title="Trocar perfil de responsável fictício"
                >
                  {responsaveis.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome} ({r.parentesco})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Multi-student switcher if parent has more than 1 child (e.g. Mariana) */}
              {alunosVinculados.length > 1 && (
                <div className="relative group">
                  <div className="flex items-center gap-1.5 bg-coral-50 border border-coral-200/80 text-coral-900 text-xs font-medium py-1.5 px-2.5 rounded-lg">
                    <GraduationCap className="w-3.5 h-3.5 text-coral-600" style={{ color: '#F27059' }} />
                    <select
                      value={activeAluno?.id || ''}
                      onChange={(e) => {
                        const kid = alunosVinculados.find((k) => k.id === e.target.value);
                        if (kid) setActiveAluno(kid);
                      }}
                      className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-4"
                      style={{ color: '#0E4D5C' }}
                      title="Selecionar aluno vinculado"
                    >
                      {alunosVinculados.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nome.split(' ')[0]} ({k.turmaNome.split(' - ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-600" style={{ backgroundColor: '#0E4D5C' }} />
              <span>Gestão Central · Niterói</span>
            </div>
          )}

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
