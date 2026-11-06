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
    setActiveModule,
  } = useSchool();

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const devAppUrl = 'https://ais-dev-duwm3v66ieuovtl55gzjmw-58247857543.us-east1.run.app';

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const { isMobileDevicePreview, setIsMobileDevicePreview } = useSchool();

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
            <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/80 ml-1 font-bold">
              Contrato Sponte: Indisponível (Aguardando autorização e chaves oficiais)
            </span>
          )}
        </div>

        {/* Quick Action Guides for Presentations */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle Simulator */}
          <button
            onClick={() => {
              setActiveModule('family');
              setIsMobileDevicePreview(!isMobileDevicePreview);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors font-semibold cursor-pointer ${
              isMobileDevicePreview
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-teal-600/30 hover:bg-teal-600/40 text-teal-200 border border-teal-500/40'
            }`}
            title="Simular visual de celular (iPhone/Samsung) na tela"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isMobileDevicePreview ? 'Sair do Simulador' : 'Simular Celular'}</span>
          </button>

          <button
            onClick={() => setShowMobileModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium cursor-pointer"
            title="Links e QR Code para celular real"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            <span>Links Mobile</span>
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
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-teal-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Como Acessar no iPhone & Samsung
                  </h3>
                  <p className="text-xs text-teal-200">
                    Entenda os links de desenvolvimento e publicação
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
            <div className="p-6 space-y-5">
              {/* Explanation of the 404 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Por que o link ais-pre deu 404?</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  No Google AI Studio, a URL final com <code>ais-pre-</code> só é ativada quando você clica no botão <strong>"Publish" / "Deploy"</strong> no canto superior direito da plataforma.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Enquanto não publica, o link ativo ao vivo é o <strong>ais-dev</strong> (abaixo), ou você pode testar diretamente com o <strong>Simulador de Celular</strong> na própria tela!
                </p>
              </div>

              {/* QR Code for dev link */}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      devAppUrl
                    )}`}
                    alt="QR Code para acesso mobile ao vivo"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">
                  Aponte a câmera do seu celular para abrir o link de desenvolvimento ativo
                </span>
              </div>

              {/* Link Ativo Dev */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
                <div className="text-[11px] font-semibold text-teal-900 flex items-center justify-between">
                  <span>1. Link Ativo de Desenvolvimento (ais-dev):</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Ativo Agora
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={devAppUrl}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={() => handleCopyLink(devAppUrl)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  * No celular, faça login com a mesma conta Google (cmourasiga@gmail.com) para visualizar o ambiente de desenvolvimento.
                </p>
              </div>

              {/* Instructions to Publish for 100% public access */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-left space-y-1">
                <div className="text-[11px] font-bold text-teal-950">
                  2. Para liberar o link público (ais-pre) sem precisar de login Google:
                </div>
                <p className="text-[11px] text-teal-800 leading-snug">
                  Clique no botão <strong>"Publish"</strong> ou <strong>"Deploy"</strong> no cabeçalho do Google AI Studio Build. Ele compilará e ativará o endereço público compartilhado para qualquer pessoa abrir!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveModule('family');
                  setShowMobileModal(false);
                  setIsMobileDevicePreview(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-50 rounded-lg border border-teal-200 transition-colors cursor-pointer"
              >
                Abrir Simulador na Tela →
              </button>
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

