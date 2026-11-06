import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const JullyStorytellingModal: React.FC = () => {
  const {
    showStorytelling,
    setShowStorytelling,
    setActiveModule,
    setAdminSection,
    setFamilySection,
    setShowSponteDocs,
  } = useSchool();

  if (!showStorytelling) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="p-6 border-b border-slate-200 flex items-start justify-between text-white shrink-0"
          style={{ backgroundColor: '#0E4D5C' }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-mono">
                Roteiro Executivo Consult Services
              </span>
              <span className="text-xs text-teal-200">Reunião Estratégica</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Storytelling de Demonstração para Apresentação à Jully
            </h2>
            <p className="text-xs text-teal-100">
              Guia passo a passo para conduzir a demonstração comercial e pedagógica com a liderança da Estação do Aprender.
            </p>
          </div>

          <button
            onClick={() => setShowStorytelling(false)}
            className="text-teal-200 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storytelling Steps */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Objetivo da Reunião
            </div>
            <p>
              Transmitir à Jully segurança absoluta: a Consult Services compreendeu perfeitamente a dor crônica da escola com a consolidação de horários/turnos e entrega uma solução sob medida, acolhedora e pronta para o ecossistema bilíngue, sem gerar ruptura com o Sponte.
            </p>
          </div>

          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <span>Abertura pela Dor Central: Consolidação de Horários e Turnos</span>
              </div>
              <button
                onClick={() => {
                  setShowStorytelling(false);
                  setActiveModule('admin');
                  setAdminSection('academico');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-teal-800 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 cursor-pointer"
              >
                <span>Navegar para Módulo A2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 pl-8 leading-relaxed">
              <strong>O que falar para a Jully:</strong> <em>"Jully, sabemos que hoje um dos maiores gargalos operacionais da Estação do Aprender é saber exatamente quem almoça na escola, quem fica até mais tarde no Smart Living e quem sai às 12h ou 15h30. Desenvolvemos esta tela de Gestão Acadêmica onde a sua equipe filtra e enxerga isso num único clique — inclusive exportando em planilha para a cozinha e para a portaria."</em>
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-coral-600 text-white flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: '#F27059' }}>
                  2
                </span>
                <span>A Experiência Encantadora das Famílias (Portal PWA)</span>
              </div>
              <button
                onClick={() => {
                  setShowStorytelling(false);
                  setActiveModule('family');
                  setFamilySection('inicio');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-coral-800 bg-white border border-coral-200 rounded-lg hover:bg-coral-50 cursor-pointer"
              >
                <span>Navegar para Portal da Família</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 pl-8 leading-relaxed">
              <strong>O que falar para a Jully:</strong> <em>"Agora veja o outro lado da moeda: como os pais experimentam a escola. Aqui estamos logados como a Mariana, mãe da Sofia (1º ano) e do Pedro (Educação Infantil). Ela alterna entre os dois filhos sem atritos, confere o cardápio da semana supervisionado pela nutricionista e acompanha as oficinas de robótica bilíngue."</em>
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <span>O Teste de Fogo: Comunicado Publicado e Visto na Hora</span>
              </div>
              <button
                onClick={() => {
                  setShowStorytelling(false);
                  setActiveModule('admin');
                  setAdminSection('comunicacao');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-teal-800 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 cursor-pointer"
              >
                <span>Criar Comunicado de Teste</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 pl-8 leading-relaxed">
              <strong>O que fazer:</strong> Crie um comunicado rápido na frente da Jully (ex: "Oficina Especial de Robótica"). Em seguida, volte ao Portal da Família e mostre a notificação aparecendo imediatamente com contagem de leitura confirmada.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </span>
                <span>Relatórios para a Operação e Exportação Excel/CSV</span>
              </div>
              <button
                onClick={() => {
                  setShowStorytelling(false);
                  setActiveModule('admin');
                  setAdminSection('relatorios');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <span>Abrir Central de Relatórios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 pl-8 leading-relaxed">
              <strong>O que falar para a Jully:</strong> <em>"Jully, toda segunda-feira sua equipe pode gerar o mapa de alimentação da semana com as restrições alimentares de cada criança e a lista de alunos por horário de saída com um único clique."</em>
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:border-teal-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  5
                </span>
                <span>O Futuro com o Sponte: Integração Serena e Segura</span>
              </div>
              <button
                onClick={() => {
                  setShowStorytelling(false);
                  setShowSponteDocs(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 cursor-pointer"
              >
                <span>Mostrar Documento Sponte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 pl-8 leading-relaxed">
              <strong>O que falar para a Jully:</strong> <em>"A escola não precisa abandonar o Sponte nem arriscar seus dados financeiros. Nós desenhamos a arquitetura para que essa interface moderna converse diretamente com os dados do Sponte através de APIs autorizadas assim que o fornecedor liberar as chaves oficiais."</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setShowStorytelling(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Fechar Roteiro
          </button>
        </div>
      </div>
    </div>
  );
};
