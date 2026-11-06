import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Instalado</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white shadow-sm transition-all cursor-pointer hover:brightness-105 active:scale-95"
        style={{ backgroundColor: '#0E4D5C' }}
        title="Instalar aplicativo no computador ou celular"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">
                  Instalar no iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <p>
                    No Safari, toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <p>
                    Role a lista e selecione <strong>Adicionar à Tela de Início</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <p>Toque em <strong>Adicionar</strong> no canto superior direito.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback visual affordance for desktop browsers
  return (
    <button
      onClick={() => alert('Para instalar este PWA: clique no ícone de instalação na barra de endereços do seu navegador ou acesse o menu ⋮ > "Instalar Estação do Aprender".')}
      className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-slate-400" />
      <span>Web App PWA</span>
    </button>
  );
};
