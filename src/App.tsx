import React from 'react';
import { SchoolProviderComponent, useSchool } from './context/SchoolContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AcademicManagement } from './components/admin/AcademicManagement';
import { FinancialManagement } from './components/admin/FinancialManagement';
import { CommunicationManagement } from './components/admin/CommunicationManagement';
import { ReportsManagement } from './components/admin/ReportsManagement';
import { FamilyHome } from './components/family/FamilyHome';
import { FamilySchedule } from './components/family/FamilySchedule';
import { FamilyCommunications } from './components/family/FamilyCommunications';
import { FamilyFinances } from './components/family/FamilyFinances';
import { FamilySchoolLife } from './components/family/FamilySchoolLife';
import { MobileApp } from './components/mobile/MobileApp';
import { SponteIntegrationModal } from './components/docs/SponteIntegrationModal';
import { JullyStorytellingModal } from './components/docs/JullyStorytellingModal';
import { AcceptanceCriteriaModal } from './components/docs/AcceptanceCriteriaModal';
import {
  LayoutDashboard,
  GraduationCap,
  DollarSign,
  MessageSquare,
  FileText,
  Home,
  Calendar,
  Clock,
  Smartphone,
  X,
  Users,
  ShieldCheck,
} from 'lucide-react';

const SchoolApp: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    adminSection,
    setAdminSection,
    familySection,
    setFamilySection,
    activeAluno,
    comunicados,
    isMobileDevicePreview,
    setIsMobileDevicePreview,
  } = useSchool();

  const unreadCount = comunicados.filter(
    (c) =>
      !c.lidoPeloUsuario &&
      (!activeAluno || c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId)
  ).length;

  // ================= 1. NATIVE SIMULATOR VIEWPORT (iPhone 15 / Samsung Galaxy Frame) =================
  if (isMobileDevicePreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        {/* Simulator Control Bar */}
        <div className="w-full max-w-[420px] mb-3 flex items-center justify-between text-white text-xs px-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-white">App Mobile Nativo (iPhone 15 / Samsung)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileDevicePreview(false);
                setActiveModule('admin');
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-teal-100 transition-colors cursor-pointer"
              title="Voltar para a visão do Painel Administrativo de Gestão para Desktop"
            >
              Ver Painel Desktop
            </button>

            <button
              onClick={() => setIsMobileDevicePreview(false)}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Fechar</span>
            </button>
          </div>
        </div>

        {/* Smartphone Hardware Frame (iPhone 15 Pro / Galaxy Style) */}
        <div className="w-full max-w-[414px] bg-[#1c1c1e] p-3 rounded-[52px] shadow-2xl border-4 border-slate-700/80 relative">
          {/* Dynamic Island Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end pr-2.5 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Smartphone Screen Viewport */}
          <div className="rounded-[42px] overflow-hidden bg-slate-50 flex flex-col h-[780px] relative">
            <MobileApp />
          </div>
        </div>

        {/* Simulator instruction notes */}
        <div className="max-w-[420px] text-center mt-3 space-y-1">
          <p className="text-[11px] text-teal-300 font-medium">
            ✓ Interface mobile nativa desenhada para celulares (sem espremer o painel desktop).
          </p>
          <p className="text-[10px] text-slate-400">
            Navegue pelos botões da barra inferior, converse com a professora ou troque para o modo coordenação no Menu.
          </p>
        </div>

        {/* Modals */}
        <SponteIntegrationModal />
        <JullyStorytellingModal />
        <AcceptanceCriteriaModal />
      </div>
    );
  }

  // ================= 2. RESPONSIVE HYBRID VIEWPORT =================
  // On smartphones (< 768px), ALWAYS render the dedicated native MobileApp
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* Top Demonstrative Banner */}
      <DemoBanner />

      {/* On mobile screens (< 768px), render dedicated native mobile experience */}
      <div className="md:hidden flex-1 flex flex-col h-[calc(100vh-42px)]">
        <MobileApp />
      </div>

      {/* On desktop/tablet (>= 768px), render the full enterprise SaaS dashboard */}
      <div className="hidden md:flex flex-col flex-1">
        <Header />

        {/* Sub-Navigation Ribbon (Responsive Desktop / Tablet) */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
              {activeModule === 'admin' ? (
                <>
                  {[
                    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
                    { id: 'academico', label: 'Acadêmico & Horários', icon: GraduationCap },
                    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
                    { id: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
                    { id: 'relatorios', label: 'Relatórios Oficiais', icon: FileText },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = adminSection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAdminSection(tab.id as any)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-teal-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        style={{ backgroundColor: isActive ? '#0E4D5C' : undefined }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  {[
                    { id: 'inicio', label: 'Início', icon: Home },
                    { id: 'agenda', label: 'Agenda Escolar', icon: Calendar },
                    {
                      id: 'comunicados',
                      label: 'Comunicados',
                      icon: MessageSquare,
                      badge: unreadCount > 0 ? unreadCount : undefined,
                    },
                    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
                    { id: 'vida-escolar', label: 'Vida Escolar & Rotina', icon: Clock },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = familySection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setFamilySection(tab.id as any)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-coral-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        style={{ backgroundColor: isActive ? '#F27059' : undefined }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="w-4 h-4 rounded-full bg-white text-coral-600 text-[10px] font-bold flex items-center justify-center">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content Area Desktop */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-8">
          {activeModule === 'admin' && (
            <>
              {adminSection === 'visao-geral' && <AdminDashboard />}
              {adminSection === 'academico' && <AcademicManagement />}
              {adminSection === 'financeiro' && <FinancialManagement />}
              {adminSection === 'comunicacao' && <CommunicationManagement />}
              {adminSection === 'relatorios' && <ReportsManagement />}
            </>
          )}

          {activeModule === 'family' && (
            <>
              {familySection === 'inicio' && <FamilyHome />}
              {familySection === 'agenda' && <FamilySchedule />}
              {familySection === 'comunicados' && <FamilyCommunications />}
              {familySection === 'financeiro' && <FamilyFinances />}
              {familySection === 'vida-escolar' && <FamilySchoolLife />}
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Documentation & Storytelling Modals */}
      <SponteIntegrationModal />
      <JullyStorytellingModal />
      <AcceptanceCriteriaModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProviderComponent>
      <SchoolApp />
    </SchoolProviderComponent>
  );
}
