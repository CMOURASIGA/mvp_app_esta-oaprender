import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Info,
  BookOpen,
  FileCode,
  CheckCircle2,
  Smartphone,
  X,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const {
    setShowStorytelling,
    setShowSponteDocs,
    setShowAcceptanceCriteria,
    providerType,
  } = useSchool();

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const sharedAppUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.origin
      : 'https://ais-pre-duwm3v66ieuovtl55gzjmw-58247857543.us-east1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <>
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Disclaimer Text */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
            <Info className="w-3.5 h-3.5" />
            <span>SPEC 00 · MVP Demonstrativo</span>
          </span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="text-slate-300 hidden md:inline">
            Dados fictícios para validação com o Colégio Estação do Aprender (Niterói).
          </span>
          {providerType === 'sponte' && (
            <span className="text-[10px] bg-teal-900/80 text-teal-300 px-1.5 py-0.5 rounded border border-teal-700/60 ml-1">
              Provedor Sponte Ativo
            </span>
          )}
        </div>

        {/* Quick Action Guides for Presentations */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowMobileModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-600/30 hover:bg-teal-600/40 text-teal-200 border border-teal-500/40 transition-colors font-medium cursor-pointer"
            title="Acessar pelo iPhone ou Samsung"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-400" />
            <span>Acessar no Celular</span>
          </button>

          <button
            onClick={() => setShowStorytelling(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors font-medium cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>Storytelling p/ Jully</span>
          </button>

          <button
            onClick={() => setShowSponteDocs(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition-colors font-medium cursor-pointer"
          >
            <FileCode className="w-3 h-3 text-teal-400" />
            <span>Integração Sponte</span>
          </button>

          <button
            onClick={() => setShowAcceptanceCriteria(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 transition-colors font-medium cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Critérios</span>
          </button>
        </div>
      </div>

      {/* Modal: Acessar no Celular (iPhone & Samsung) */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-teal-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Visão Mobile · iPhone & Samsung
                  </h3>
                  <p className="text-xs text-teal-200">
                    Acesse o Portal da Família direto no smartphone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileModal(false)}
                className="text-teal-200 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-center">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      sharedAppUrl
                    )}`}
                    alt="QR Code para acesso mobile"
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">
                  Aponte a câmera do seu <strong>iPhone</strong> ou <strong>Samsung</strong> para escanear
                </span>
              </div>

              {/* Direct Link & Copy */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500">
                  Link direto de homologação:
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sharedAppUrl}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-step for iPhone and Samsung */}
              <div className="grid grid-cols-2 gap-3 text-left pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>🍏 No iPhone (Safari)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Abra no Safari e toque em <strong>Compartilhar</strong> &gt; <strong>Adicionar à Tela de Início</strong> para rodar como aplicativo nativo.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>🤖 No Samsung (Chrome)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Toque no banner <strong>Instalar App</strong> ou no menu <strong>⋮</strong> &gt; <strong>Instalar Aplicativo</strong> para fixar na tela inicial.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowMobileModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

