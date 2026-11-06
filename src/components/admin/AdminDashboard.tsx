import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PeriodoEscolar } from '../../types/school';
import {
  Users,
  Clock,
  FileCheck2,
  DollarSign,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Filter,
  CheckCircle,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { turmas, alunos, comunicados, setAdminSection } = useSchool();

  const [filtroTurma, setFiltroTurma] = useState<string>('TODAS');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('TODOS');

  // Filtered dataset
  const filteredAlunos = useMemo(() => {
    return alunos.filter((a) => {
      const matchTurma = filtroTurma === 'TODAS' || a.turmaId === filtroTurma;
      const matchPeriodo = filtroPeriodo === 'TODOS' || a.periodo === filtroPeriodo;
      return matchTurma && matchPeriodo;
    });
  }, [alunos, filtroTurma, filtroPeriodo]);

  // Derived indicators
  const stats = useMemo(() => {
    const totalMatriculas = filteredAlunos.length;
    const porPeriodo: Record<PeriodoEscolar, number> = {
      Manhã: 0,
      Tarde: 0,
      Integral: 0,
      Intermediário: 0,
    };
    const porSituacao = {
      Ativa: 0,
      'Em Renovação': 0,
      Pendente: 0,
      Trancada: 0,
    };

    let totalSmartLiving = 0;
    let totalAlmoco = 0;
    let totalColacao = 0;

    filteredAlunos.forEach((a) => {
      porPeriodo[a.periodo] = (porPeriodo[a.periodo] || 0) + 1;
      porSituacao[a.situacao] = (porSituacao[a.situacao] || 0) + 1;
      if (a.smartLiving) totalSmartLiving++;
      if (a.almoco) totalAlmoco++;
      if (a.colacao) totalColacao++;
    });

    return {
      totalMatriculas,
      porPeriodo,
      porSituacao,
      totalSmartLiving,
      totalAlmoco,
      totalColacao,
    };
  }, [filteredAlunos]);

  return (
    <div className="space-y-6">
      {/* Welcome & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <Building2 className="w-4 h-4" />
            <span>Colégio Estação do Aprender · Niterói</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Painel Executivo de Gestão Escolar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Indicadores acadêmicos, ocupação de turmas, consolidação de horários e finanças.
          </p>
        </div>

        {/* Global Filters (SPEC A1) */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Turma:</span>
            <select
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="TODAS">Todas as Turmas (8)</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Período:</span>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="TODOS">Todos os Períodos</option>
              <option value="Integral">Integral</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>

          {(filtroTurma !== 'TODAS' || filtroPeriodo !== 'TODOS') && (
            <button
              onClick={() => {
                setFiltroTurma('TODAS');
                setFiltroPeriodo('TODOS');
              }}
              className="text-xs text-teal-700 hover:text-teal-900 font-medium px-2 py-1 underline cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Matrículas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Matrículas no Escopo
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {stats.totalMatriculas}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                / {filtroTurma === 'TODAS' ? 175 : turmas.find(t => t.id === filtroTurma)?.capacidade || 25} vagas
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>90.8% ocupação global</span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#E6F2F4', color: '#0E4D5C' }}
          >
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Smart Living & Contraturno */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Smart Living (Contraturno)
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {stats.totalSmartLiving}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                alunos inscritos
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-coral-600 mt-1 font-medium" style={{ color: '#D9533C' }}>
              <span>Robótica, Maker & Oficinas</span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FDEEEB', color: '#F27059' }}
          >
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Finanças em Aberto */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contas a Receber (Demonstrativo)
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              R$ 513.050
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inadimplência de 4.8%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Comunicados Emitidos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Comunicados Ativos
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {comunicados.length + 23}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 mt-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Taxa de leitura média 88%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Distribution by Period & Turmas Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Período */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Distribuição por Período Contratado
            </h2>
            <span className="text-xs text-slate-400">Total: {stats.totalMatriculas}</span>
          </div>

          <div className="space-y-4">
            {(
              [
                { periodo: 'Integral', label: 'Período Integral (07h30 às 18h30)', color: '#0E4D5C', count: stats.porPeriodo.Integral },
                { periodo: 'Intermediário', label: 'Intermediário (07h30 às 15h30)', color: '#166A7D', count: stats.porPeriodo.Intermediário },
                { periodo: 'Manhã', label: 'Matutino (07h30 às 12h00 / 13h30)', color: '#F27059', count: stats.porPeriodo.Manhã },
                { periodo: 'Tarde', label: 'Vespertino (13h00 às 17h30 / 18h30)', color: '#E8A838', count: stats.porPeriodo.Tarde },
              ] as const
            ).map((item) => {
              const pct = stats.totalMatriculas > 0 ? Math.round((item.count / stats.totalMatriculas) * 100) : 0;
              return (
                <div key={item.periodo} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.periodo}</span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {item.count} alunos ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Serviços adicionais contratados:</span>
            <div className="flex items-center gap-3 font-medium">
              <span className="text-teal-800">Almoço: {stats.totalAlmoco}</span>
              <span className="text-slate-300">·</span>
              <span className="text-coral-700">Colação: {stats.totalColacao}</span>
            </div>
          </div>
        </div>

        {/* Ocupação por Turma */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ocupação de Alunos por Turma
              </h2>
              <p className="text-xs text-slate-500">
                Segmentos de Educação Infantil e Ensino Fundamental Bilíngue
              </p>
            </div>
            <button
              onClick={() => setAdminSection('academico')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 underline cursor-pointer"
            >
              Ver Tabela Completa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {turmas.map((t) => {
              const turmaAlunos = alunos.filter((a) => a.turmaId === t.id);
              const ocupados = turmaAlunos.length;
              const taxa = Math.round((ocupados / t.capacidade) * 100);

              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{t.nome}</div>
                      <div className="text-[11px] text-slate-500">{t.segmento}</div>
                    </div>
                    <span
                      className={`text-[11px] font-mono tabular-nums font-semibold px-2 py-0.5 rounded ${
                        taxa >= 95
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200/60'
                      }`}
                    >
                      {ocupados}/{t.capacidade} ({taxa}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mt-2.5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(taxa, 100)}%`,
                        backgroundColor: taxa >= 95 ? '#D97706' : '#0E4D5C',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="truncate max-w-[160px]">{t.professorRegente}</span>
                    <span className="font-medium text-slate-700">{t.periodo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Administrative Pendencies & Financial Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pendências Administrativas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Pendências Administrativas Prioritárias
                </h2>
                <p className="text-xs text-slate-500">
                  Documentação cadastral, atestados médicos e autorizações
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              4 pendências ativas
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                tipo: 'Atestado Médico',
                aluno: 'Theo Martins',
                turma: '2º Ano Bilíngue - Beta',
                detalhe: 'Atestado cardiológico para atividades aquáticas e contraturno esportivo',
                urgencia: 'Alta',
              },
              {
                tipo: 'Documento',
                aluno: 'Arthur Guimarães',
                turma: 'Toddler 1 (G1)',
                detalhe: 'Cópia autenticada de certidão de nascimento e caderneta vacinal 2026',
                urgencia: 'Média',
              },
              {
                tipo: 'Autorização',
                aluno: 'Lucas Nogueira',
                turma: '3º Ano Bilíngue - Gamma',
                detalhe: 'Termo de autorização de saída desacompanhado ou van escolar de terceiros',
                urgencia: 'Baixa',
              },
              {
                tipo: 'Ficha Cadastral',
                aluno: 'Felipe Alencar',
                turma: '4º Ano Bilíngue - Delta',
                detalhe: 'Confirmação de contato telefônico de emergência com os responsáveis',
                urgencia: 'Baixa',
              },
            ].map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{p.aluno}</span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">{p.turma}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        p.urgencia === 'Alta'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : p.urgencia === 'Média'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.urgencia}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.detalhe}</p>
                </div>
                <button
                  onClick={() => alert(`Ação simulada: Notificação enviada para os responsáveis de ${p.aluno}.`)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shrink-0 cursor-pointer"
                >
                  Cobrar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Situação dos Contratos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Situação dos Contratos 2026
            </h2>
            <FileCheck2 className="w-5 h-5 text-teal-700" />
          </div>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-teal-950">Contratos Ativos</div>
                <div className="text-[11px] text-teal-700">Matrícula regularizada</div>
              </div>
              <span className="text-lg font-bold font-mono text-teal-900 tabular-nums">
                {stats.porSituacao.Ativa}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-950">Em Renovação</div>
                <div className="text-[11px] text-amber-700">Em análise financeira/pedagógica</div>
              </div>
              <span className="text-lg font-bold font-mono text-amber-900 tabular-nums">
                {stats.porSituacao['Em Renovação']}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-950">Pendência Cadastral</div>
                <div className="text-[11px] text-rose-700">Aguardando assinatura/dados</div>
              </div>
              <span className="text-lg font-bold font-mono text-rose-900 tabular-nums">
                {stats.porSituacao.Pendente}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Trancada / Cancelada</div>
                <div className="text-[11px] text-slate-500">Mudança de cidade / outros</div>
              </div>
              <span className="text-lg font-bold font-mono text-slate-700 tabular-nums">
                {stats.porSituacao.Trancada}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setAdminSection('relatorios')}
              className="text-xs font-medium text-teal-800 hover:text-teal-900 underline cursor-pointer"
            >
              Exportar Relatório Consolidado de Contratos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
