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
  BookOpen,
} from 'lucide-react';

const SchoolApp: React.FC = () => {
  const {
    activeModule,
    adminSection,
    setAdminSection,
    familySection,
    setFamilySection,
    activeAluno,
    comunicados,
  } = useSchool();

  const unreadCount = comunicados.filter(
    (c) =>
      !c.lidoPeloUsuario &&
      (!activeAluno || c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* Top Demonstrative Banner */}
      <DemoBanner />

      {/* Primary Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
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

      {/* Mobile Fixed Bottom Tab Bar for Family Portal (as specified in Mobile Reference 10) */}
      {activeModule === 'family' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-16 pb-safe px-1 shadow-lg">
          {[
            { id: 'inicio', label: 'Início', icon: Home },
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            {
              id: 'comunicados',
              label: 'Avisos',
              icon: MessageSquare,
              badge: unreadCount > 0 ? unreadCount : undefined,
            },
            { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
            { id: 'vida-escolar', label: 'Rotina', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = familySection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFamilySection(tab.id as any)}
                className={`flex flex-col items-center justify-center h-full relative cursor-pointer ${
                  isActive ? 'text-coral-600 font-bold' : 'text-slate-500'
                }`}
                style={{ color: isActive ? '#F27059' : undefined }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Documentation & Storytelling Modals */}
      <SponteIntegrationModal />
      <JullyStorytellingModal />
      <AcceptanceCriteriaModal />

      {/* Footer with Consult Services credit */}
      <Footer />
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
