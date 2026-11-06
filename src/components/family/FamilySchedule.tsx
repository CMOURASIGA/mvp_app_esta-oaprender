import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  Sparkles,
} from 'lucide-react';

export const FamilySchedule: React.FC = () => {
  const { eventos, activeAluno, alunosVinculados, setActiveAluno, setFamilySection } = useSchool();
  const [selectedMonth, setSelectedMonth] = useState('Abril 2026');

  // Filter events matching active student or all
  const filteredEventos = eventos.filter(
    (e) => !activeAluno || e.turmasIds.includes('TODAS') || e.turmasIds.includes(activeAluno.turmaId)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <CalendarIcon className="w-4 h-4" />
            <span>Módulo B3 · Agenda & Calendário Escolar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Calendário de Atividades & Encontros
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Eventos pedagógicos, feiras bilíngues, reuniões e datas comemorativas do Colégio Estação do Aprender.
          </p>
        </div>

        {/* Student Switcher if multiple */}
        {alunosVinculados.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
            <span className="text-xs text-slate-500 font-medium pl-1">Filtrar por aluno:</span>
            {alunosVinculados.map((k) => (
              <button
                key={k.id}
                onClick={() => setActiveAluno(k)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeAluno?.id === k.id
                    ? 'bg-teal-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ backgroundColor: activeAluno?.id === k.id ? '#0E4D5C' : undefined }}
              >
                {k.nome.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Navigation Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setSelectedMonth('Março 2026')}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-bold text-slate-900">{selectedMonth}</h2>
          <span className="text-xs text-slate-400">1º Trimestre Letivo · Ano 2026</span>
        </div>

        <button
          onClick={() => setSelectedMonth('Maio 2026')}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Events Timeline / Cards */}
      <div className="space-y-4">
        {filteredEventos.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              {/* Date Box */}
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200/80 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[11px] font-bold uppercase text-teal-700 tracking-wider">
                  {new Date(evt.data + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold font-mono text-teal-950 tabular-nums">
                  {new Date(evt.data + 'T00:00:00').getDate()}
                </span>
              </div>

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      evt.tipo === 'Evento Escolar'
                        ? 'bg-coral-100 text-coral-800'
                        : evt.tipo === 'Atividade Bilíngue'
                        ? 'bg-teal-100 text-teal-800'
                        : evt.tipo === 'Reunião'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {evt.tipo}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.horarioInicio} às {evt.horarioFim}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{evt.titulo}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{evt.descricao}</p>

                <div className="flex items-center gap-1 text-xs text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.local}</span>
                </div>
              </div>
            </div>

            {/* Quick Action if linked announcement exists */}
            {evt.comunicadoVinculadoId && (
              <div className="shrink-0">
                <button
                  onClick={() => setFamilySection('comunicados')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-teal-800 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Comunicado Vinculado</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
