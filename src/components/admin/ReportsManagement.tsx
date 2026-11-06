import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { exportToCSV } from '../../utils/csvExport';
import {
  FileText,
  Download,
  Users,
  Clock,
  Utensils,
  Sparkles,
  DollarSign,
  Filter,
  Check,
  Building,
} from 'lucide-react';

type ReportTab = 'turmas' | 'horarios' | 'alimentacao' | 'smartLiving' | 'financeiro';

export const ReportsManagement: React.FC = () => {
  const { alunos, turmas, titulos } = useSchool();
  const [activeTab, setActiveTab] = useState<ReportTab>('horarios'); // default to horarios as it's the school's primary challenge
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

  // Export handlers for each report
  const handleExportHorarios = () => {
    exportToCSV(
      'relatorio_horarios_contratados_estacao_aprender',
      filteredAlunos.map((a) => ({
        matricula: a.matricula,
        nome: a.nome,
        turma: a.turmaNome,
        periodo: a.periodo,
        horarioEntrada: a.horarioEntrada,
        horarioSaida: a.horarioSaida,
        permanenciaEstimada: a.periodo === 'Integral' ? '11h' : a.periodo === 'Intermediário' ? '8h' : '4h30',
        situacao: a.situacao,
      })),
      [
        { key: 'matricula', label: 'Matrícula' },
        { key: 'nome', label: 'Nome do Aluno' },
        { key: 'turma', label: 'Turma' },
        { key: 'periodo', label: 'Período Contratado' },
        { key: 'horarioEntrada', label: 'Horário de Entrada' },
        { key: 'horarioSaida', label: 'Horário de Saída' },
        { key: 'permanenciaEstimada', label: 'Carga Horária / Dia' },
        { key: 'situacao', label: 'Situação' },
      ]
    );
  };

  const handleExportAlimentacao = () => {
    exportToCSV(
      'relatorio_alimentacao_colacao_almoco_estacao_aprender',
      filteredAlunos.map((a) => ({
        matricula: a.matricula,
        nome: a.nome,
        turma: a.turmaNome,
        colacao: a.colacao ? 'Sim' : 'Não',
        almoco: a.almoco ? 'Sim' : 'Não',
        restricoes: a.restricoesAlimentares?.join(', ') || 'Nenhuma restrição',
      })),
      [
        { key: 'matricula', label: 'Matrícula' },
        { key: 'nome', label: 'Nome do Aluno' },
        { key: 'turma', label: 'Turma' },
        { key: 'colacao', label: 'Colação Matutina' },
        { key: 'almoco', label: 'Almoço Nutricional' },
        { key: 'restricoes', label: 'Alergias / Restrições' },
      ]
    );
  };

  const handleExportSmartLiving = () => {
    exportToCSV(
      'relatorio_smart_living_contraturno_estacao_aprender',
      filteredAlunos
        .filter((a) => a.smartLiving)
        .map((a) => ({
          matricula: a.matricula,
          nome: a.nome,
          turma: a.turmaNome,
          periodo: a.periodo,
          modalidades: a.smartLivingModalidades?.join(', ') || 'Geral',
        })),
      [
        { key: 'matricula', label: 'Matrícula' },
        { key: 'nome', label: 'Nome do Aluno' },
        { key: 'turma', label: 'Turma' },
        { key: 'periodo', label: 'Período Contratado' },
        { key: 'modalidades', label: 'Oficinas Matriculadas' },
      ]
    );
  };

  const handleExportTurmas = () => {
    exportToCSV(
      'relatorio_ocupacao_turmas_estacao_aprender',
      turmas.map((t) => {
        const total = alunos.filter((a) => a.turmaId === t.id).length;
        return {
          turma: t.nome,
          segmento: t.segmento,
          periodo: t.periodo,
          sala: t.sala,
          capacidade: t.capacidade,
          alunosMatriculados: total,
          vagasDisponiveis: t.capacidade - total,
          taxaOcupacao: `${Math.round((total / t.capacidade) * 100)}%`,
          professorRegente: t.professorRegente,
        };
      }),
      [
        { key: 'turma', label: 'Turma' },
        { key: 'segmento', label: 'Segmento' },
        { key: 'periodo', label: 'Período' },
        { key: 'sala', label: 'Sala de Aula' },
        { key: 'capacidade', label: 'Capacidade Total' },
        { key: 'alunosMatriculados', label: 'Matrículas Ativas' },
        { key: 'vagasDisponiveis', label: 'Vagas Livres' },
        { key: 'taxaOcupacao', label: 'Taxa Ocupação' },
        { key: 'professorRegente', label: 'Corpo Docente Regente' },
      ]
    );
  };

  const handleExportFinanceiro = () => {
    exportToCSV(
      'relatorio_pendencias_financeiras_estacao_aprender',
      titulos
        .filter((t) => t.situacao === 'Vencida' || t.situacao === 'A vencer')
        .map((t) => ({
          id: t.id,
          aluno: t.alunoNome,
          competencia: t.competencia,
          vencimento: t.vencimento,
          valor: t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          situacao: t.situacao,
        })),
      [
        { key: 'id', label: 'ID Título' },
        { key: 'aluno', label: 'Aluno Favorecido' },
        { key: 'competencia', label: 'Competência' },
        { key: 'vencimento', label: 'Vencimento' },
        { key: 'valor', label: 'Valor' },
        { key: 'situacao', label: 'Status' },
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <FileText className="w-4 h-4" />
            <span>Módulo A5 · Central de Relatórios Oficiais</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Relatórios Operacionais & Acadêmicos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Geração de listagens e consolidações estratégicas para secretaria, coordenação e nutrição.
          </p>
        </div>

        {/* Global CSV Download for Current Tab */}
        <button
          onClick={() => {
            if (activeTab === 'horarios') handleExportHorarios();
            else if (activeTab === 'alimentacao') handleExportAlimentacao();
            else if (activeTab === 'smartLiving') handleExportSmartLiving();
            else if (activeTab === 'turmas') handleExportTurmas();
            else if (activeTab === 'financeiro') handleExportFinanceiro();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ backgroundColor: '#0E4D5C' }}
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório Ativo (CSV)</span>
        </button>
      </div>

      {/* Tabs Selector (SPEC A5) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { id: 'horarios', label: 'Horários Contratados (Entrada/Saída)', icon: Clock },
          { id: 'alimentacao', label: 'Serviços de Alimentação', icon: Utensils },
          { id: 'smartLiving', label: 'Contraturno Smart Living', icon: Sparkles },
          { id: 'turmas', label: 'Alunos por Turma', icon: Users },
          { id: 'financeiro', label: 'Pendências Financeiras', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReportTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-teal-800' : 'text-slate-400'
                }`}
                style={{ color: isActive ? '#0E4D5C' : undefined }}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Turma:</span>
            <select
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Todas as Turmas ({turmas.length})</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Período:</span>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Todos os Períodos</option>
              <option value="Integral">Integral</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredAlunos.length} registros correspondentes
        </div>
      </div>

      {/* Active Tab View */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* TAB 1: Horários Contratados */}
        {activeTab === 'horarios' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Aluno & Matrícula</th>
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3">Período</th>
                  <th className="py-3 px-3">Entrada Oficial</th>
                  <th className="py-3 px-3">Saída Oficial</th>
                  <th className="py-3 px-3">Permanência</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlunos.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{a.nome}</td>
                    <td className="py-3 px-3 text-slate-600">{a.turmaNome}</td>
                    <td className="py-3 px-3 font-medium text-teal-900">{a.periodo}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{a.horarioEntrada}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{a.horarioSaida}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {a.periodo === 'Integral' ? '11h / dia' : a.periodo === 'Intermediário' ? '8h / dia' : '4h30 / dia'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {a.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Alimentação */}
        {activeTab === 'alimentacao' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Aluno & Matrícula</th>
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3 text-center">Colação Matutina</th>
                  <th className="py-3 px-3 text-center">Almoço Nutricional</th>
                  <th className="py-3 px-4">Restrições Alimentares Cadastradas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlunos.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{a.nome}</td>
                    <td className="py-3 px-3 text-slate-600">{a.turmaNome}</td>
                    <td className="py-3 px-3 text-center">
                      {a.colacao ? (
                        <span className="text-teal-700 font-bold">Sim (09h30)</span>
                      ) : (
                        <span className="text-slate-400">Não</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {a.almoco ? (
                        <span className="text-amber-700 font-bold">Sim (11h45)</span>
                      ) : (
                        <span className="text-slate-400">Não</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {a.restricoesAlimentares && a.restricoesAlimentares.length > 0 ? (
                        <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {a.restricoesAlimentares.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sem restrições</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Smart Living */}
        {activeTab === 'smartLiving' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Aluno</th>
                  <th className="py-3 px-3">Turma</th>
                  <th className="py-3 px-3">Turno</th>
                  <th className="py-3 px-4">Oficinas / Modalidades no Contraturno</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlunos
                  .filter((a) => a.smartLiving)
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{a.nome}</td>
                      <td className="py-3 px-3 text-slate-600">{a.turmaNome}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{a.periodo}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {a.smartLivingModalidades?.map((m, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-coral-50 text-coral-900 rounded font-medium border border-coral-200/60"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Turmas */}
        {activeTab === 'turmas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Turma</th>
                  <th className="py-3 px-3">Segmento</th>
                  <th className="py-3 px-3">Sala</th>
                  <th className="py-3 px-3">Período</th>
                  <th className="py-3 px-3 text-center">Matrículas / Vagas</th>
                  <th className="py-3 px-3 text-center">Taxa Ocupação</th>
                  <th className="py-3 px-4">Docentes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {turmas.map((t) => {
                  const total = alunos.filter((a) => a.turmaId === t.id).length;
                  const taxa = Math.round((total / t.capacidade) * 100);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.nome}</td>
                      <td className="py-3 px-3 text-slate-600">{t.segmento}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{t.sala}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{t.periodo}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        {total} / {t.capacidade}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-teal-800">{taxa}%</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{t.professorRegente}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Financeiro */}
        {activeTab === 'financeiro' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Título ID</th>
                  <th className="py-3 px-4">Aluno</th>
                  <th className="py-3 px-3">Competência</th>
                  <th className="py-3 px-3">Vencimento</th>
                  <th className="py-3 px-3 font-mono">Valor</th>
                  <th className="py-3 px-3 text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {titulos.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">{t.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{t.alunoNome}</td>
                    <td className="py-3 px-3 text-slate-600">{t.competencia}</td>
                    <td className="py-3 px-3 font-mono">{t.vencimento}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.situacao === 'Paga'
                            ? 'bg-emerald-50 text-emerald-800'
                            : t.situacao === 'A vencer'
                            ? 'bg-sky-50 text-sky-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {t.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
