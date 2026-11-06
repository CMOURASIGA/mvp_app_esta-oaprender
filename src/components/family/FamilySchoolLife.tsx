import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Utensils,
  Sparkles,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const FamilySchoolLife: React.FC = () => {
  const { activeAluno } = useSchool();

  if (!activeAluno) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Selecione um aluno para acompanhar a vida escolar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <GraduationCap className="w-4 h-4" />
            <span>Módulo B6 · Vida Escolar & Desenvolvimento</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Rotina Diária & Serviços de {activeAluno.nome}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Consolidação completa de horários contratados, alimentação, contraturno Smart Living e frequência.
          </p>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
          Matrícula: {activeAluno.matricula}
        </div>
      </div>

      {/* Grid: Horários Contratados & Turno (Core SPEC Focus) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Grade de Horários & Permanência Contratada
            </h2>
            <p className="text-xs text-slate-500">
              {activeAluno.turmaNome} · Período {activeAluno.periodo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Entrada e Saída:</span>
            <span className="font-mono font-bold text-sm text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              {activeAluno.horarioEntrada} às {activeAluno.horarioSaida}
            </span>
          </div>
        </div>

        {/* Daily Schedule Timeline */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Cronograma Típico da Jornada Bilíngue:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-teal-800 font-bold">
                <span>07:30 - 08:30</span>
                <span>Acolhida</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Welcome Circle & Morning Ritual</div>
              <p className="text-[11px] text-slate-500">
                Chegada acolhedora, rodas de conversa em inglês e planejamento do dia.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 font-bold">
                <span>09:30 - 10:00</span>
                <span>Colação</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Lanche Nutritivo da Manhã</div>
              <p className="text-[11px] text-slate-500">
                {activeAluno.colacao ? 'Frutas frescas orgânicas, pães integrais e sucos naturais.' : 'Horário para colação trazida de casa.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-teal-800 font-bold">
                <span>11:45 - 12:45</span>
                <span>Almoço</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Refeição Completa & Relaxamento</div>
              <p className="text-[11px] text-slate-500">
                {activeAluno.almoco
                  ? 'Cardápio balanceado com supervisão nutricional e incentivo à autonomia.'
                  : 'Saída dos alunos de meio período matutino.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-coral-50/60 border border-coral-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-coral-800 font-bold">
                <span>15:30 - 18:30</span>
                <span>Smart Living</span>
              </div>
              <div className="text-xs font-bold text-coral-950">Oficinas Maker & STEAM</div>
              <p className="text-[11px] text-coral-900/80">
                {activeAluno.smartLiving
                  ? `Atividades práticas: ${activeAluno.smartLivingModalidades?.join(', ')}`
                  : 'Horário de estudos ou saída dos turnos parciais.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Alimentação & Smart Living with Generated Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cardápio & Alimentação (com foto gerada) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Programa de Alimentação Escolar
                </h3>
                <p className="text-xs text-slate-500">Supervisionado pela Nutricionista Dra. Fernanda Lima</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {activeAluno.almoco ? 'Almoço + Colação Inclusos' : 'Colação'}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden h-40 relative border border-slate-100">
            <img
              src="/src/assets/images/nutritious_lunch_kids_1793968614103.jpg"
              alt="Alimentação saudável e balanceada Estação do Aprender"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
              Alimentos frescos de produtores do Rio & Niterói
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Destaques do Cardápio desta Semana:</div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Arroz integral, feijão carioca, filé de frango grelhado às ervas finas e purê de abóbora cabotiá.</li>
              <li>Saladinha colorida com tomate cereja, cenoura ralada e folhas verdes higienizadas.</li>
              <li>Sobremesa: Fruta da estação (manga em cubos ou melancia).</li>
            </ul>

            <div className="pt-2 border-t border-slate-200 text-slate-600">
              <strong className="text-slate-800">Alergias / Restrições do Aluno: </strong>
              {activeAluno.restricoesAlimentares && activeAluno.restricoesAlimentares.length > 0 ? (
                <span className="text-rose-700 font-bold">{activeAluno.restricoesAlimentares.join(', ')}</span>
              ) : (
                <span className="text-slate-500">Nenhuma restrição registrada.</span>
              )}
            </div>
          </div>
        </div>

        {/* Smart Living Extracurricular (com foto gerada) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-coral-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Programa Smart Living (Contraturno)
                </h3>
                <p className="text-xs text-slate-500">Educação Maker, STEAM e imersão cultural</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-coral-50 text-coral-800 border border-coral-200">
              {activeAluno.smartLiving ? 'Inscrito(a)' : 'Opcional'}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden h-40 relative border border-slate-100">
            <img
              src="/src/assets/images/smart_living_robotics_1793968614816.jpg"
              alt="Oficinas de Robótica STEAM e Maker para crianças"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
              Robótica Maker & STEAM Lab
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-coral-50/50 border border-coral-200/60 space-y-2 text-xs">
            <div className="font-bold text-coral-950">Oficinas em Andamento:</div>
            {activeAluno.smartLivingModalidades && activeAluno.smartLivingModalidades.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeAluno.smartLivingModalidades.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-coral-200 text-xs font-medium text-coral-900 shadow-2xs"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                O aluno não está matriculado nas oficinas do contraturno no momento. Consulte a coordenação para novas vagas.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Acompanhamento Pedagógico & Frequência */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-800" />
            <h3 className="text-base font-bold text-slate-900">
              Desenvolvimento Bilíngue & Frequência 2026
            </h3>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {activeAluno.frequenciaPercentual}% de presença
          </div>
        </div>

        {activeAluno.observacoesPedagogicas && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
            "{activeAluno.observacoesPedagogicas}"
          </div>
        )}
      </div>
    </div>
  );
};
