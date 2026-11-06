import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Aluno } from '../../types/school';
import { exportToCSV } from '../../utils/csvExport';
import {
  Search,
  Clock,
  Utensils,
  Sparkles,
  Check,
  X,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

export const AcademicManagement: React.FC = () => {
  const { alunos, turmas, responsaveis } = useSchool();

  const [busca, setBusca] = useState('');
  const [filtroTurma, setFiltroTurma] = useState<string>('TODAS');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('TODOS');
  const [filtroSmartLiving, setFiltroSmartLiving] = useState<boolean>(false);
  const [filtroAlmoco, setFiltroAlmoco] = useState<boolean>(false);
  const [filtroSituacao, setFiltroSituacao] = useState<string>('TODAS');

  // Selected student for detail modal
  const [alunoDetalhe, setAlunoDetalhe] = useState<Aluno | null>(null);

  // Filtered dataset
  const filteredAlunos = useMemo(() => {
    return alunos.filter((aluno) => {
      const matchBusca =
        !busca.trim() ||
        aluno.nome.toLowerCase().includes(busca.toLowerCase().trim()) ||
        aluno.matricula.toLowerCase().includes(busca.toLowerCase().trim());

      const matchTurma = filtroTurma === 'TODAS' || aluno.turmaId === filtroTurma;
      const matchPeriodo = filtroPeriodo === 'TODOS' || aluno.periodo === filtroPeriodo;
      const matchSmartLiving = !filtroSmartLiving || aluno.smartLiving;
      const matchAlmoco = !filtroAlmoco || aluno.almoco;
      const matchSituacao = filtroSituacao === 'TODAS' || aluno.situacao === filtroSituacao;

      return matchBusca && matchTurma && matchPeriodo && matchSmartLiving && matchAlmoco && matchSituacao;
    });
  }, [alunos, busca, filtroTurma, filtroPeriodo, filtroSmartLiving, filtroAlmoco, filtroSituacao]);

  const handleExportCSV = () => {
    exportToCSV(
      'estacao_do_aprender_gestao_academica_horarios_servicos',
      filteredAlunos.map((a) => ({
        matricula: a.matricula,
        nome: a.nome,
        turma: a.turmaNome,
        serie: a.serie,
        periodo: a.periodo,
        horarioEntrada: a.horarioEntrada,
        horarioSaida: a.horarioSaida,
        colacao: a.colacao ? 'Sim' : 'Não',
        almoco: a.almoco ? 'Sim' : 'Não',
        smartLiving: a.smartLiving ? 'Sim' : 'Não',
        modalidadesSmartLiving: a.smartLivingModalidades?.join(', ') || '-',
        restricoesAlimentares: a.restricoesAlimentares?.join(', ') || 'Nenhuma',
        situacao: a.situacao,
        frequencia: `${a.frequenciaPercentual}%`,
      })),
      [
        { key: 'matricula', label: 'Matrícula' },
        { key: 'nome', label: 'Nome do Aluno' },
        { key: 'turma', label: 'Turma' },
        { key: 'serie', label: 'Série' },
        { key: 'periodo', label: 'Período Contratado' },
        { key: 'horarioEntrada', label: 'Horário de Entrada' },
        { key: 'horarioSaida', label: 'Horário de Saída' },
        { key: 'colacao', label: 'Colação Matutina' },
        { key: 'almoco', label: 'Almoço Escolar' },
        { key: 'smartLiving', label: 'Smart Living (Contraturno)' },
        { key: 'modalidadesSmartLiving', label: 'Oficinas Smart Living' },
        { key: 'restricoesAlimentares', label: 'Restrições Alimentares' },
        { key: 'situacao', label: 'Situação Contratual' },
        { key: 'frequencia', label: 'Frequência Letiva' },
      ]
    );
  };

  const getResponsavelDoAluno = (aluno: Aluno) => {
    return responsaveis.find((r) => r.id === aluno.responsavelId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <Clock className="w-4 h-4" />
            <span>Módulo A2 · Gestão Acadêmica & Horários</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Consolidação de Alunos, Horários e Serviços
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Solução dedicada para o mapeamento claro de turnos, colação, almoço e oficinas de contraturno Smart Living.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ backgroundColor: '#0E4D5C' }}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar Planilha CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar aluno ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-teal-600 focus:bg-white"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Turma */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Turma:</span>
            <select
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Todas as Turmas ({turmas.length})</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Período:</span>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Todos os Períodos</option>
              <option value="Integral">Integral (07h30 - 18h30)</option>
              <option value="Intermediário">Intermediário (07h30 - 15h30)</option>
              <option value="Manhã">Manhã (07h30 - 12h00)</option>
              <option value="Tarde">Tarde (13h00 - 17h30)</option>
            </select>
          </div>

          {/* Situação */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Situação:</span>
            <select
              value={filtroSituacao}
              onChange={(e) => setFiltroSituacao(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Todas as Situações</option>
              <option value="Ativa">Matrícula Ativa</option>
              <option value="Em Renovação">Em Renovação</option>
              <option value="Pendente">Pendente</option>
              <option value="Trancada">Trancada</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles for Services (Almoço, Smart Living) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-slate-400 font-medium">Filtrar Serviços:</span>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filtroAlmoco}
                onChange={(e) => setFiltroAlmoco(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600 w-4 h-4"
              />
              <span className={`font-medium ${filtroAlmoco ? 'text-teal-900 font-semibold' : 'text-slate-600'}`}>
                Apenas com Almoço
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filtroSmartLiving}
                onChange={(e) => setFiltroSmartLiving(e.target.checked)}
                className="rounded border-slate-300 text-coral-600 focus:ring-coral-500 w-4 h-4"
              />
              <span className={`font-medium ${filtroSmartLiving ? 'text-coral-900 font-semibold' : 'text-slate-600'}`}>
                Apenas Smart Living (Contraturno)
              </span>
            </label>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Exibindo <strong>{filteredAlunos.length}</strong> de <strong>{alunos.length}</strong> alunos
          </div>
        </div>
      </div>

      {/* Primary Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Aluno & Matrícula</th>
                <th className="py-3.5 px-3">Turma</th>
                <th className="py-3.5 px-3">Período Contratado</th>
                <th className="py-3.5 px-3">Horário Oficial</th>
                <th className="py-3.5 px-2 text-center">Colação</th>
                <th className="py-3.5 px-2 text-center">Almoço</th>
                <th className="py-3.5 px-3 text-center">Smart Living</th>
                <th className="py-3.5 px-3 text-center">Situação</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Nenhum aluno encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAlunos.map((aluno) => {
                  const resp = getResponsavelDoAluno(aluno);

                  return (
                    <tr
                      key={aluno.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Aluno & Matrícula */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-teal-900">
                          {aluno.nome}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {aluno.matricula}
                          {resp && ` · Resp: ${resp.nome.split(' ')[0]}`}
                        </div>
                      </td>

                      {/* Turma */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">
                          {aluno.turmaNome}
                        </span>
                        <div className="text-[11px] text-slate-400">{aluno.serie}</div>
                      </td>

                      {/* Período Contratado */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            aluno.periodo === 'Integral'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                              : aluno.periodo === 'Intermediário'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200/60'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {aluno.periodo}
                        </span>
                      </td>

                      {/* Horário Oficial */}
                      <td className="py-3 px-3">
                        <div className="font-mono tabular-nums font-semibold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{aluno.horarioEntrada} - {aluno.horarioSaida}</span>
                        </div>
                      </td>

                      {/* Colação */}
                      <td className="py-3 px-2 text-center">
                        {aluno.colacao ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      {/* Almoço */}
                      <td className="py-3 px-2 text-center">
                        {aluno.almoco ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      {/* Smart Living */}
                      <td className="py-3 px-3 text-center">
                        {aluno.smartLiving ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-coral-50 text-coral-800 border border-coral-200/60" style={{ color: '#D9533C' }}>
                            <Sparkles className="w-3 h-3 text-coral-500" />
                            <span>Sim</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Situação */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            aluno.situacao === 'Ativa'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : aluno.situacao === 'Em Renovação'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {aluno.situacao}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setAlunoDetalhe(aluno)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-teal-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Ver ficha completa do aluno"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Detalhes do Aluno */}
      {alunoDetalhe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    {alunoDetalhe.matricula}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      alunoDetalhe.situacao === 'Ativa'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {alunoDetalhe.situacao}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1.5">
                  {alunoDetalhe.nome}
                </h2>
                <p className="text-xs text-slate-500">
                  {alunoDetalhe.serie} · {alunoDetalhe.turmaNome}
                </p>
              </div>

              <button
                onClick={() => setAlunoDetalhe(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Consolidação de Horários e Turno (SPEC A2 Core) */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    Consolidação de Horário Contratado
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-teal-800 text-white">
                    Período {alunoDetalhe.periodo}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-teal-100">
                    <div className="text-[11px] text-slate-500">Horário de Entrada</div>
                    <div className="text-base font-bold font-mono text-slate-900">
                      {alunoDetalhe.horarioEntrada}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-teal-100">
                    <div className="text-[11px] text-slate-500">Horário de Saída</div>
                    <div className="text-base font-bold font-mono text-slate-900">
                      {alunoDetalhe.horarioSaida}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-teal-100 col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-slate-500">Permanência Diária</div>
                    <div className="text-base font-bold font-mono text-teal-800">
                      {alunoDetalhe.periodo === 'Integral'
                        ? '11h / dia'
                        : alunoDetalhe.periodo === 'Intermediário'
                        ? '8h / dia'
                        : '4h30 / dia'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alimentação e Smart Living */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Serviços de Alimentação */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    Serviços de Alimentação
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Colação Matutina:</span>
                      <span className="font-semibold text-slate-900">
                        {alunoDetalhe.colacao ? 'Inclusa (09h30)' : 'Não contratada'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Almoço Nutricional:</span>
                      <span className="font-semibold text-slate-900">
                        {alunoDetalhe.almoco ? 'Incluso (11h45)' : 'Não contratado'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-slate-500">
                      <span className="font-medium text-slate-700">Restrições Alimentares: </span>
                      {alunoDetalhe.restricoesAlimentares && alunoDetalhe.restricoesAlimentares.length > 0 ? (
                        <span className="text-rose-700 font-semibold">
                          {alunoDetalhe.restricoesAlimentares.join(', ')}
                        </span>
                      ) : (
                        <span>Nenhuma restrição registrada</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Smart Living Contraturno */}
                <div className="p-4 rounded-xl bg-coral-50/50 border border-coral-200/70 space-y-2">
                  <div className="text-xs font-bold text-coral-950 flex items-center gap-1.5" style={{ color: '#D9533C' }}>
                    <Sparkles className="w-4 h-4 text-coral-600" />
                    Programa Smart Living (Contraturno)
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Participação:</span>
                      <span className="font-bold text-coral-900">
                        {alunoDetalhe.smartLiving ? 'Ativa' : 'Não matriculado'}
                      </span>
                    </div>
                    {alunoDetalhe.smartLiving && alunoDetalhe.smartLivingModalidades && (
                      <div className="pt-1.5">
                        <div className="text-[11px] text-slate-500 mb-1">Oficinas matriculadas:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {alunoDetalhe.smartLivingModalidades.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-white border border-coral-200 text-[11px] font-medium text-coral-900"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Frequência & Acompanhamento Pedagógico */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Frequência Letiva 2026</span>
                  <span className="font-mono font-bold text-teal-800 tabular-nums">
                    {alunoDetalhe.frequenciaPercentual}% ({alunoDetalhe.presencasContabilizadas}/{alunoDetalhe.diasLetivosTotal} dias)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-700 rounded-full"
                    style={{ width: `${alunoDetalhe.frequenciaPercentual}%` }}
                  />
                </div>
                {alunoDetalhe.observacoesPedagogicas && (
                  <p className="text-slate-600 pt-2 border-t border-slate-200 italic">
                    "{alunoDetalhe.observacoesPedagogicas}"
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setAlunoDetalhe(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
