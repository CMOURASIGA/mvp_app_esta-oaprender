import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setShowSponteDocs, setShowStorytelling, setShowAcceptanceCriteria } = useSchool();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Logo size="sm" showSubtitle={false} />
            <div className="text-xs text-slate-500">
              <span>Colégio Estação do Aprender · Niterói/RJ</span>
              <span className="mx-2 hidden sm:inline">·</span>
              <span className="block sm:inline font-medium text-slate-700">
                Tecnologia desenvolvida por Consult Services
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <button
              onClick={() => setShowStorytelling(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Storytelling Comercial
            </button>
            <span>·</span>
            <button
              onClick={() => setShowSponteDocs(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Arquitetura Sponte
            </button>
            <span>·</span>
            <button
              onClick={() => setShowAcceptanceCriteria(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Critérios de Aceite SPEC 00
            </button>
            <span>·</span>
            <span className="text-slate-400">Ambiente Homologado v0.1</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            Demonstrativo estritamente funcional para homologação prévia da diretoria pedagógica e administrativa. Não utilizar dados reais.
          </p>
          <p>© {new Date().getFullYear()} Colégio Estação do Aprender & Consult Services Tecnologia.</p>
        </div>
      </div>
    </footer>
  );
};
