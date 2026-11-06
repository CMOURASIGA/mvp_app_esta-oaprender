import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Calendar,
  MessageSquare,
  DollarSign,
  Clock,
  Utensils,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

export const FamilyHome: React.FC = () => {
  const {
    activeResponsavel,
    activeAluno,
    alunosVinculados,
    setActiveAluno,
    comunicados,
    eventos,
    titulos,
    setFamilySection,
  } = useSchool();

  if (!activeResponsavel || !activeAluno) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Selecione um responsável para visualizar o portal da família.</p>
      </div>
    );
  }

  // Filter student announcements & events
  const unreadComunicados = comunicados.filter(
    (c) =>
      !c.lidoPeloUsuario &&
      (c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId)
  );

  const upcomingEventos = eventos
    .filter((e) => e.turmasIds.includes('TODAS') || e.turmasIds.includes(activeAluno.turmaId))
    .slice(0, 3);

  const alunoTitulos = titulos.filter((t) => t.alunoId === activeAluno.id);
  const nextTitulo = alunoTitulos.find((t) => t.situacao === 'A vencer') || alunoTitulos[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner with Photo */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 text-white min-h-[190px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/family_welcome_banner_1793968626318.jpg"
          alt="Recepção acolhedora do Colégio Estação do Aprender"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-semibold backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Colégio Estação do Aprender · Portal da Família</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Olá, {activeResponsavel.nome.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-200 max-w-xl">
            Acompanhe em tempo real a rotina escolar, horários, comunicados e o desenvolvimento bilíngue de{' '}
            <strong className="text-teal-300">{activeAluno.nome}</strong>.
          </p>
        </div>
      </div>

      {/* Student Switcher if Multiple Children */}
      {alunosVinculados.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <GraduationCap className="w-4 h-4 text-coral-600" style={{ color: '#F27059' }} />
            <span className="font-semibold text-slate-700">Filhos matriculados na Estação:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alunosVinculados.map((kid) => {
              const isSelected = kid.id === activeAluno.id;
              return (
                <button
                  key={kid.id}
                  onClick={() => setActiveAluno(kid)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={{ backgroundColor: isSelected ? '#0E4D5C' : undefined }}
                >
                  <span>{kid.nome}</span>
                  <span className="text-[10px] opacity-80">({kid.turmaNome.split(' - ')[0]})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Student Quick Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm shrink-0"
              style={{ backgroundColor: '#0E4D5C' }}
            >
              {activeAluno.nome.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{activeAluno.nome}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  {activeAluno.situacao}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeAluno.turmaNome} · Matrícula: <span className="font-mono">{activeAluno.matricula}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFamilySection('vida-escolar')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
            >
              <span>Ver Rotina Completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Info Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>Horário Contratado</span>
            </div>
            <div className="text-sm font-bold font-mono text-slate-900">
              {activeAluno.horarioEntrada} - {activeAluno.horarioSaida}
            </div>
            <div className="text-[11px] text-teal-800 font-medium">Período {activeAluno.periodo}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Alimentação</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {activeAluno.almoco ? 'Almoço + Colação' : activeAluno.colacao ? 'Colação da manhã' : 'Lanche próprio'}
            </div>
            <div className="text-[11px] text-slate-500">Supervisão nutricional</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-coral-600" />
              <span>Smart Living</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {activeAluno.smartLiving ? 'Inscrito(a)' : 'Não optante'}
            </div>
            <div className="text-[11px] text-coral-700 font-medium">Oficinas STEAM Bilíngues</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Frequência</span>
            </div>
            <div className="text-sm font-bold font-mono text-emerald-800">
              {activeAluno.frequenciaPercentual}%
            </div>
            <div className="text-[11px] text-slate-500">
              {activeAluno.presencasContabilizadas}/{activeAluno.diasLetivosTotal} dias letivos
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Comunicados Recentes + Próximos Eventos + Resumo Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comunicados Recentes (SPEC B2 & B4) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-800" style={{ color: '#0E4D5C' }} />
              <div>
                <h3 className="text-base font-bold text-slate-900">Comunicados Recentes</h3>
                <p className="text-xs text-slate-500">Avisos e informativos pedagógicos para a família</p>
              </div>
            </div>
            <button
              onClick={() => setFamilySection('comunicados')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 underline cursor-pointer"
            >
              Ver Todos ({comunicados.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {comunicados.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => setFamilySection('comunicados')}
                className="py-3.5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 p-2 rounded-xl transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.categoria === 'Smart Living'
                          ? 'bg-coral-100 text-coral-800'
                          : c.categoria === 'Alimentação'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-50 text-teal-800'
                      }`}
                    >
                      {c.categoria}
                    </span>
                    {!c.lidoPeloUsuario && (
                      <span className="w-2 h-2 rounded-full bg-coral-500" title="Não lido" />
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">{c.dataEnvio.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                    {c.titulo}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.conteudo}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Financeiro & Próximos Eventos */}
        <div className="space-y-6">
          {/* Card Resumo Financeiro */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-800" />
                <h3 className="text-base font-bold text-slate-900">Mensalidade Escolar</h3>
              </div>
              <button
                onClick={() => setFamilySection('financeiro')}
                className="text-xs font-semibold text-teal-800 underline cursor-pointer"
              >
                Extrato
              </button>
            </div>

            {nextTitulo ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Competência {nextTitulo.competencia}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded ${
                      nextTitulo.situacao === 'Paga'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {nextTitulo.situacao}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {nextTitulo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Vencimento: <strong>{nextTitulo.vencimento}</strong></span>
                  <button
                    onClick={() => setFamilySection('financeiro')}
                    className="text-teal-800 font-semibold hover:underline"
                  >
                    Ver boleto simulado
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nenhum título em aberto para o aluno.</p>
            )}
          </div>

          {/* Próximos Eventos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-coral-600" />
                <h3 className="text-base font-bold text-slate-900">Agenda da Semana</h3>
              </div>
              <button
                onClick={() => setFamilySection('agenda')}
                className="text-xs font-semibold text-coral-700 underline cursor-pointer"
              >
                Calendário
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEventos.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setFamilySection('agenda')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-coral-700">{e.tipo}</span>
                    <span className="text-slate-400 font-mono">{e.data}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{e.titulo}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{e.horarioInicio} às {e.horarioFim} · {e.local}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
