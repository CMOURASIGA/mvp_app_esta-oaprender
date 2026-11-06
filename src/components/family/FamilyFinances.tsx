import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TituloFinanceiro } from '../../types/school';
import {
  DollarSign,
  FileText,
  Copy,
  Check,
  X,
  Info,
} from 'lucide-react';

export const FamilyFinances: React.FC = () => {
  const { titulos, activeAluno } = useSchool();
  const [tituloAberto, setTituloAberto] = useState<TituloFinanceiro | null>(null);
  const [copiado, setCopiado] = useState(false);

  const studentTitulos = titulos.filter(
    (t) => !activeAluno || t.alunoId === activeAluno.id
  );

  const handleCopyLinha = (linha: string) => {
    navigator.clipboard.writeText(linha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <DollarSign className="w-4 h-4" />
            <span>Módulo B5 · Financeiro da Família</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Mensalidades & Extrato Financeiro
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Acompanhamento transparente das mensalidades escolares e serviços contratados.
          </p>
        </div>

        <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-xl font-medium flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Ambiente de demonstração · Sem cobrança real</span>
        </div>
      </div>

      {/* Titulos List */}
      <div className="space-y-4">
        {studentTitulos.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    t.situacao === 'Paga'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.situacao === 'A vencer'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {t.situacao === 'Paga' ? 'Pago' : t.situacao}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Competência {t.competencia}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-mono">
                  Vencimento: {t.vencimento}
                </span>
              </div>

              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>

              <div className="text-xs text-slate-500">
                Aluno favorecido: <strong>{t.alunoNome}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              {t.situacao === 'Paga' ? (
                <button
                  onClick={() => setTituloAberto(t)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Comprovante</span>
                </button>
              ) : (
                <button
                  onClick={() => setTituloAberto(t)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-xs hover:brightness-105 cursor-pointer"
                  style={{ backgroundColor: '#0E4D5C' }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Linha Digitável</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Título Financeiro Demonstrativo (SPEC B5) */}
      {tituloAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mensalidade Escolar Demonstrativa
                  </h3>
                  <div className="text-xs text-slate-500">
                    Competência {tituloAberto.competencia} · {tituloAberto.alunoNome}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTituloAberto(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Aviso de Homologação:</strong> Título demonstrativo (SPEC 00). Não efetuar pagamentos reais.
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Data de Vencimento:</span>
                  <span className="font-mono font-bold text-slate-800">{tituloAberto.vencimento}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Situação:</span>
                  <span className="font-bold text-slate-800">{tituloAberto.situacao}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Valor Total:</span>
                  <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {tituloAberto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Serviços inclusos */}
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-slate-700">Composição contratual:</div>
                {tituloAberto.servicosDescricao.map((s, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-600">
                    • {s}
                  </div>
                ))}
              </div>

              {/* Linha Digitável */}
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Código de Pagamento (Simulação):</span>
                  <button
                    onClick={() => handleCopyLinha(tituloAberto.linhaDigitavelDemonstrativa)}
                    className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                  >
                    {copiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-teal-300 tracking-wider break-all select-all">
                  {tituloAberto.linhaDigitavelDemonstrativa}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setTituloAberto(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
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
