import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Comunicado } from '../../types/school';
import {
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react';

export const FamilyCommunications: React.FC = () => {
  const { comunicados, activeAluno, marcarComoLido } = useSchool();
  const [comunicadoAberto, setComunicadoAberto] = useState<Comunicado | null>(null);

  // Filter announcements for current student's class or all classes
  const studentComunicados = comunicados.filter(
    (c) => !activeAluno || c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId
  );

  const handleOpen = async (c: Comunicado) => {
    setComunicadoAberto(c);
    if (!c.lidoPeloUsuario) {
      await marcarComoLido(c.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <MessageSquare className="w-4 h-4" />
            <span>Módulo B4 · Mural de Comunicados da Família</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Comunicados & Circulares Oficiais
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Mensagens da coordenação, nutrição e direção sincronizadas em tempo real nesta sessão.
          </p>
        </div>

        {activeAluno && (
          <div className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700">
            Filtrando para: <strong>{activeAluno.nome}</strong> ({activeAluno.turmaNome})
          </div>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {studentComunicados.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            Nenhum comunicado disponível no momento para esta turma.
          </div>
        ) : (
          studentComunicados.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpen(c)}
              className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer group hover:shadow-md ${
                c.lidoPeloUsuario
                  ? 'border-slate-200/90'
                  : 'border-2 border-teal-600/40 bg-teal-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.categoria === 'Smart Living'
                        ? 'bg-coral-100 text-coral-800'
                        : c.categoria === 'Alimentação'
                        ? 'bg-amber-100 text-amber-800'
                        : c.categoria === 'Urgente'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-50 text-teal-800 border border-teal-200/60'
                    }`}
                  >
                    {c.categoria}
                  </span>

                  {!c.lidoPeloUsuario && (
                    <span className="text-[11px] font-bold text-coral-600 bg-coral-50 border border-coral-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
                      Não Lido
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.dataEnvio}</span>
                  </span>
                  <span>·</span>
                  <span>{c.autorNome}</span>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900">
                  {c.titulo}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {c.conteudo}
                </p>
              </div>

              {c.anexoNome && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <Paperclip className="w-3.5 h-3.5 text-teal-700" />
                  <span className="font-medium">{c.anexoNome}</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Clique para ler o conteúdo na íntegra</span>
                <span className="font-semibold text-teal-800 group-hover:underline">
                  Abrir comunicado →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Leitura Completa de Comunicado (SPEC B4) */}
      {comunicadoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                    {comunicadoAberto.categoria}
                  </span>
                  <span className="text-xs text-slate-400">
                    {comunicadoAberto.dataEnvio}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {comunicadoAberto.titulo}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Emitido por: {comunicadoAberto.autorNome} · Destino: {comunicadoAberto.turmaDestinoNome}
                </div>
              </div>

              <button
                onClick={() => setComunicadoAberto(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {comunicadoAberto.conteudo}
              </div>

              {comunicadoAberto.anexoNome && (
                <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Paperclip className="w-4 h-4 text-teal-700" />
                    <span className="font-medium">{comunicadoAberto.anexoNome}</span>
                    {comunicadoAberto.anexoTamanho && (
                      <span className="text-slate-400">({comunicadoAberto.anexoTamanho})</span>
                    )}
                  </div>
                  <button
                    onClick={() => alert(`Download simulado do arquivo ${comunicadoAberto.anexoNome}`)}
                    className="inline-flex items-center gap-1 text-teal-800 font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>
              )}

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Leitura confirmada com sucesso para a coordenação pedagógica.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setComunicadoAberto(null)}
                className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs cursor-pointer hover:brightness-105"
                style={{ backgroundColor: '#0E4D5C' }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
