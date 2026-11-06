import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TituloFinanceiro, SituacaoFinanceira } from '../../types/school';
import { exportToCSV } from '../../utils/csvExport';
import {
  DollarSign,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  X,
  Building,
  Info,
} from 'lucide-react';

export const FinancialManagement: React.FC = () => {
  const { titulos, alunos } = useSchool();

  const [filtroSituacao, setFiltroSituacao] = useState<string>('TODAS');
  const [filtroCompetencia, setFiltroCompetencia] = useState<string>('TODAS');
  const [buscaAluno, setBuscaAluno] = useState<string>('');

  // Title in inspection modal
  const [tituloSelecionado, setTituloSelecionado] = useState<TituloFinanceiro | null>(null);
  const [copiado, setCopiado] = useState(false);

  const filteredTitulos = useMemo(() => {
    return titulos.filter((t) => {
      const matchSituacao = filtroSituacao === 'TODAS' || t.situacao === filtroSituacao;
      const matchComp = filtroCompetencia === 'TODAS' || t.competencia === filtroCompetencia;
      const matchBusca =
        !buscaAluno.trim() ||
        t.alunoNome.toLowerCase().includes(buscaAluno.toLowerCase().trim()) ||
        t.id.toLowerCase().includes(buscaAluno.toLowerCase().trim());
      return matchSituacao && matchComp && matchBusca;
    });
  }, [titulos, filtroSituacao, filtroCompetencia, buscaAluno]);

  // Aggregates
  const financialSummary = useMemo(() => {
    let aVencer = 0;
    let vencidas = 0;
    let pagas = 0;

    titulos.forEach((t) => {
      if (t.situacao === 'A vencer') aVencer += t.valor;
      else if (t.situacao === 'Vencida') vencidas += t.valor;
      else if (t.situacao === 'Paga') pagas += t.valor;
    });

    return {
      aVencer,
      vencidas,
      pagas,
      totalEmAberto: aVencer + vencidas,
    };
  }, [titulos]);

  const handleCopyLinha = (linha: string) => {
    navigator.clipboard.writeText(linha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleExportCSV = () => {
    exportToCSV(
      'estacao_do_aprender_financeiro_titulos_demonstrativo',
      filteredTitulos.map((t) => ({
        id: t.id,
        aluno: t.alunoNome,
        competencia: t.competencia,
        vencimento: t.vencimento,
        valor: t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        situacao: t.situacao,
        dataPagamento: t.dataPagamento || '-',
        servicos: t.servicosDescricao.join(' | '),
      })),
      [
        { key: 'id', label: 'ID Título' },
        { key: 'aluno', label: 'Aluno' },
        { key: 'competencia', label: 'Competência' },
        { key: 'vencimento', label: 'Vencimento' },
        { key: 'valor', label: 'Valor (R$)' },
        { key: 'situacao', label: 'Situação' },
        { key: 'dataPagamento', label: 'Data Pagamento' },
        { key: 'servicos', label: 'Serviços Contratados' },
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <DollarSign className="w-4 h-4" />
            <span>Módulo A3 · Painel Financeiro Escolar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Gestão de Mensalidades & Contas a Receber
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Demonstrativo de títulos, fluxo de pagamentos e histórico financeiro institucional.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ backgroundColor: '#0E4D5C' }}
        >
          <Download className="w-4 h-4" />
          <span>Exportar Títulos CSV</span>
        </button>
      </div>

      {/* Financial KPI Strips (SPEC A3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total em Aberto */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total em Aberto
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-2">
            {financialSummary.totalEmAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            A vencer + vencidos consolidados
          </div>
        </div>

        {/* Mensalidades A Vencer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mensalidades a Vencer
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-sky-900 tabular-nums mt-2">
            {financialSummary.aVencer.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-xs text-sky-700 mt-1 font-medium">
            Competência 04/2026 em fluxo regular
          </div>
        </div>

        {/* Mensalidades Vencidas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mensalidades Vencidas
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-800 tabular-nums mt-2">
            {financialSummary.vencidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-xs text-rose-700 mt-1 font-medium">
            8 títulos com alerta de cobrança
          </div>
        </div>

        {/* Mensalidades Pagas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mensalidades Pagas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mt-2">
            {financialSummary.pagas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            95.2% de adimplência na competência 03
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por aluno ou ID do título..."
            value={buscaAluno}
            onChange={(e) => setBuscaAluno(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-teal-600 focus:bg-white"
          />

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Situação:</span>
            <select
              value={filtroSituacao}
              onChange={(e) => setFiltroSituacao(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Todas</option>
              <option value="A vencer">A vencer</option>
              <option value="Vencida">Vencida</option>
              <option value="Paga">Paga</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Competência:</span>
            <select
              value={filtroCompetencia}
              onChange={(e) => setFiltroCompetencia(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="TODAS">Todas as Competências</option>
              <option value="04/2026">04/2026 (Abril)</option>
              <option value="03/2026">03/2026 (Março)</option>
              <option value="02/2026">02/2026 (Fevereiro)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredTitulos.length} títulos listados
        </div>
      </div>

      {/* Titles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Título ID</th>
                <th className="py-3.5 px-4">Aluno Vinculado</th>
                <th className="py-3.5 px-3">Competência</th>
                <th className="py-3.5 px-3">Vencimento</th>
                <th className="py-3.5 px-3">Valor Nominal</th>
                <th className="py-3.5 px-3 text-center">Situação</th>
                <th className="py-3.5 px-4 text-right">Consulta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTitulos.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{t.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{t.alunoNome}</td>
                  <td className="py-3 px-3 font-medium text-slate-600">{t.competencia}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-700">{t.vencimento}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                    {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        t.situacao === 'Paga'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : t.situacao === 'A vencer'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200/60'
                          : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                      }`}
                    >
                      {t.situacao}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setTituloSelecionado(t)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-teal-800 hover:bg-teal-50 transition-colors font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Título</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Consulta Individual de Título Financeiro Demonstrativo (SPEC A3) */}
      {tituloSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Consulta de Título Escolar Demonstrativo
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    ID: {tituloSelecionado.id} · Competência: {tituloSelecionado.competencia}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTituloSelecionado(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Notice banner */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Documento Ilustrativo (SPEC 00):</strong> Não há cobrança bancária real, emissão de Pix nem baixa financeira ativa nesta demonstração.
                </div>
              </div>

              {/* Title Summary Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Aluno Favorecido</span>
                  <span className="text-sm font-bold text-slate-900">{tituloSelecionado.alunoNome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Data de Vencimento</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{tituloSelecionado.vencimento}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Situação do Título</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      tituloSelecionado.situacao === 'Paga'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tituloSelecionado.situacao === 'A vencer'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tituloSelecionado.situacao}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Valor Total</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {tituloSelecionado.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Detailed Services Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Composição dos Serviços Escolares:
                </div>
                <div className="space-y-1.5">
                  {tituloSelecionado.servicosDescricao.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between"
                    >
                      <span>{srv}</span>
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Linha Digitável Simulada */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Linha Digitável (Simulação):</span>
                  <button
                    onClick={() => handleCopyLinha(tituloSelecionado.linhaDigitavelDemonstrativa)}
                    className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                  >
                    {copiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-teal-300 tracking-wider break-all select-all">
                  {tituloSelecionado.linhaDigitavelDemonstrativa}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setTituloSelecionado(null)}
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
