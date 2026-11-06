import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Comunicado, TituloFinanceiro } from '../../types/school';
import {
  Bell,
  Search,
  MessageSquare,
  Calendar,
  DollarSign,
  Clock,
  Home,
  Menu,
  ChevronRight,
  GraduationCap,
  Users,
  Utensils,
  Sparkles,
  CheckCircle2,
  Paperclip,
  Copy,
  Check,
  Send,
  X,
  ArrowLeft,
  ChevronDown,
  Wifi,
  Battery,
  AlertTriangle,
  LayoutGrid,
} from 'lucide-react';

export const MobileApp: React.FC = () => {
  const {
    activeAluno,
    alunosVinculados,
    setActiveAluno,
    comunicados,
    eventos,
    titulos,
    marcarComoLido,
    setActiveModule,
    setShowSponteDocs,
    setShowStorytelling,
    setIsMobileDevicePreview,
  } = useSchool();

  // Active bottom tab
  type MobileTab = 'inicio' | 'financeiro' | 'comunicacao' | 'rotina' | 'mais';
  const [activeTab, setActiveTab] = useState<MobileTab>('comunicacao');

  // Sub-tabs in Comunicação: Conversas vs Eventos (Like Reference)
  const [comunicacaoSubTab, setComunicacaoSubTab] = useState<'conversas' | 'eventos'>('conversas');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected announcement for read drawer
  const [comunicadoAberto, setComunicadoAberto] = useState<Comunicado | null>(null);

  // Floating chat teaser visibility (the speech balloon in the user screenshot)
  const [showFloatingTeaser, setShowFloatingTeaser] = useState(true);

  // Quick Direct Chat Simulator with Teacher / Coordination
  const [chatAberto, setChatAberto] = useState(false);
  const [chatMensagens, setChatMensagens] = useState([
    {
      id: 1,
      remetente: 'Profª. Beatriz Duarte & Teacher Oliver',
      texto: 'Olá, Mariana! Sofia teve um dia maravilhoso hoje na Unit of Inquiry e adorou a aula de Robótica.',
      hora: '10:25',
      ehEscola: true,
    },
    {
      id: 2,
      remetente: 'Você',
      texto: 'Que ótimo! Hoje ela sai no horário normal do integral às 18h30?',
      hora: '10:30',
      ehEscola: false,
    },
    {
      id: 3,
      remetente: 'Coordenação Estação',
      texto: 'Sim! Às 18h30 com a colação e almoço devidamente cumpridos. Tenha uma ótima tarde!',
      hora: '10:32',
      ehEscola: true,
    },
  ]);
  const [novaMsg, setNovaMsg] = useState('');

  // Category Drawers
  const [modalContatosEscolares, setModalContatosEscolares] = useState(false);
  const [modalGrupos, setModalGrupos] = useState(false);

  // Finance modal / quick copy
  const [tituloAberto, setTituloAberto] = useState<TituloFinanceiro | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Student switcher drawer
  const [showKidSwitcher, setShowKidSwitcher] = useState(false);

  // Mobile Coordinator/Teacher View toggle (inside mobile view)
  const [modoCoordenacaoMobile, setModoCoordenacaoMobile] = useState(false);

  if (!activeAluno) return null;

  const unreadCount = comunicados.filter(
    (c) =>
      !c.lidoPeloUsuario &&
      (c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId)
  ).length;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMsg.trim()) return;

    const userMsg = {
      id: Date.now(),
      remetente: 'Você',
      texto: novaMsg.trim(),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ehEscola: false,
    };

    setChatMensagens((prev) => [...prev, userMsg]);
    setNovaMsg('');

    // Simulated quick response from school
    setTimeout(() => {
      setChatMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remetente: 'Profª. Beatriz Duarte',
          texto: 'Recebido com sucesso! Registramos no prontuário diário de Sofia.',
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          ehEscola: true,
        },
      ]);
    }, 900);
  };

  const filteredComunicados = comunicados.filter((c) => {
    const matchTurma = c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === activeAluno.turmaId;
    const matchSearch =
      !searchQuery.trim() ||
      c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.conteudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTurma && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 antialiased select-none relative overflow-hidden font-sans">
      {/* 1. Curved Brand Top App Bar (Teal Aesthetic matching attached design) */}
      <div
        className="text-white pt-2.5 pb-5 px-5 rounded-b-[30px] shadow-sm relative z-20 shrink-0"
        style={{
          background: 'linear-gradient(135deg, #0E4D5C 0%, #0A3641 100%)',
        }}
      >
        {/* Mobile Status Bar (10:39, Wifi, Battery) */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-teal-100/90 mb-3 px-1">
          <span>10:39</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px]">5G</span>
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Top Header Row (Title, Bell, Avatar Switcher) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_estacao.png"
              alt="Logo Colégio Estação do Aprender"
              className="h-8 w-auto object-contain bg-white rounded-lg p-0.5 shadow-xs"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                {modoCoordenacaoMobile
                  ? 'Painel Equipe Escolar'
                  : activeTab === 'comunicacao'
                  ? 'Comunicação'
                  : activeTab === 'inicio'
                  ? 'Estação do Aprender'
                  : activeTab === 'financeiro'
                  ? 'Financeiro'
                  : activeTab === 'rotina'
                  ? 'Rotina & Horários'
                  : 'Menu & Opções'}
              </h1>
              <p className="text-[11px] text-teal-200 font-medium">
                {modoCoordenacaoMobile
                  ? 'Modo Coordenação e Docência'
                  : `${activeAluno.nome.split(' ')[0]} · ${activeAluno.turmaNome.split(' - ')[0]}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('comunicacao')}
              className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#F27059' }}
                />
              )}
            </button>

            {/* Profile Avatar / Student Switcher */}
            <button
              onClick={() => setShowKidSwitcher(true)}
              className="relative flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-full pl-1 pr-2 py-0.5 border border-white/20 transition-colors cursor-pointer"
              title="Trocar aluno ou perfil"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                style={{ backgroundColor: '#F27059' }}
              >
                {activeAluno.nome.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-teal-200" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 pb-24 space-y-4">
        {/* ================= MODO COORDENAÇÃO ESCOLAR (MOBILE STAFF) ================= */}
        {modoCoordenacaoMobile ? (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">
                  Visão Docente: Profª. Beatriz Duarte
                </span>
              </div>
              <button
                onClick={() => setModoCoordenacaoMobile(false)}
                className="text-[11px] font-bold text-teal-900 underline cursor-pointer"
              >
                Voltar p/ Família
              </button>
            </div>

            {/* Quick Roll-Call Summary */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Turma Toddler A · Presença Hoje</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  10 / 10 Presentes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Saída Meio Período</div>
                  <div className="font-bold text-slate-800">12:30 (4 alunos)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Saída Integral</div>
                  <div className="font-bold text-teal-800">18:30 (6 alunos)</div>
                </div>
              </div>
            </div>

            {/* Quick Dietary Restrictions Alert */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Alerta Nutricional (Colação & Almoço)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Sofia Vasconcellos:</strong> Sem lactose na colação da manhã (09h30). Cardápio substituto verificado pela nutricionista.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setChatAberto(true)}
                className="p-3 bg-white border border-slate-200/80 rounded-2xl text-left space-y-1 shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-teal-800" />
                <div className="text-xs font-bold text-slate-900">Responder Pais</div>
                <div className="text-[10px] text-slate-500">1 mensagem pendente</div>
              </button>

              <button
                onClick={() => {
                  setComunicacaoSubTab('conversas');
                  setActiveTab('comunicacao');
                }}
                className="p-3 bg-white border border-slate-200/80 rounded-2xl text-left space-y-1 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-coral-600" />
                <div className="text-xs font-bold text-slate-900">Avisos da Turma</div>
                <div className="text-[10px] text-slate-500">Ver comunicados</div>
              </button>
            </div>
          </div>
        ) : null}

        {/* ================= SCREEN: COMUNICAÇÃO (Matching Attachment) ================= */}
        {!modoCoordenacaoMobile && activeTab === 'comunicacao' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Sub-Tabs: Conversas vs Eventos (Like Reference) */}
            <div className="flex items-center border-b border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setComunicacaoSubTab('conversas')}
                className={`flex-1 pb-2.5 flex items-center justify-center gap-2 relative transition-colors cursor-pointer ${
                  comunicacaoSubTab === 'conversas'
                    ? 'text-teal-950 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {unreadCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: '#F27059' }}
                  >
                    {unreadCount}
                  </span>
                )}
                <span>Conversas</span>
                {comunicacaoSubTab === 'conversas' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#0E4D5C' }}
                  />
                )}
              </button>

              <button
                onClick={() => setComunicacaoSubTab('eventos')}
                className={`flex-1 pb-2.5 flex items-center justify-center gap-2 relative transition-colors cursor-pointer ${
                  comunicacaoSubTab === 'eventos'
                    ? 'text-teal-950 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Eventos</span>
                {comunicacaoSubTab === 'eventos' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#0E4D5C' }}
                  />
                )}
              </button>
            </div>

            {/* Pill Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquise uma conversa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs placeholder-slate-400 shadow-2xs focus:outline-teal-700"
              />
            </div>

            {comunicacaoSubTab === 'conversas' ? (
              <div className="space-y-3">
                {/* Categories Header (Like Attachment) */}
                <div className="pt-0.5">
                  <div className="text-xs font-bold text-slate-900">Categorias</div>
                  <div className="text-[11px] text-slate-400">Escolha um tipo de conversa</div>
                </div>

                {/* 1. Contatos Escolares Card */}
                <div
                  onClick={() => setModalContatosEscolares(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-teal-300 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#E6F2F4', color: '#0E4D5C' }}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        Contatos Escolares
                      </div>
                      <div className="text-[11px] text-slate-400">Contatos da escola</div>
                      <p className="text-[11px] text-slate-600 truncate max-w-[210px] mt-0.5">
                        Coordenação : Olá! Tudo bem, Professora e equipe à disposição...
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>

                {/* 2. Grupos Card */}
                <div
                  onClick={() => setModalGrupos(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-teal-300 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-800"
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        Grupos
                      </div>
                      <div className="text-[11px] text-slate-400">Grupos de turmas</div>
                      <p className="text-[11px] text-slate-600 truncate max-w-[210px] mt-0.5">
                        Turma Toddler A : Boa tarde pessoal! Lembrete do piquenique bilíngue...
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>

                {/* 3. Conversas Individuais Card (Direct Chat) */}
                <div
                  onClick={() => setChatAberto(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-teal-300 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#FDEEEB', color: '#F27059' }}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug flex items-center gap-1.5">
                        <span>Conversas Individuais</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-[11px] text-slate-400">Mensagens Diretas</div>
                      <p className="text-[11px] text-teal-800 font-medium truncate max-w-[210px] mt-0.5">
                        Profª. Beatriz Duarte : {chatMensagens[chatMensagens.length - 1]?.texto}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>

                {/* Section Header: School Announcements */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-900">Avisos Oficiais da Escola</div>
                  <div className="text-[11px] text-slate-400">Circulares pedagógicas e avisos</div>
                </div>

                {/* List of Official Announcements */}
                <div className="space-y-2.5">
                  {filteredComunicados.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setComunicadoAberto(c);
                        if (!c.lidoPeloUsuario) marcarComoLido(c.id);
                      }}
                      className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99] flex items-start justify-between gap-3 ${
                        c.lidoPeloUsuario
                          ? 'border-slate-200/80'
                          : 'border-teal-500/50 bg-teal-50/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon Box */}
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor:
                              c.categoria === 'Smart Living'
                                ? '#FDEEEB'
                                : c.categoria === 'Alimentação'
                                ? '#FEF3C7'
                                : '#E6F2F4',
                            color:
                              c.categoria === 'Smart Living'
                                ? '#F27059'
                                : c.categoria === 'Alimentação'
                                ? '#D97706'
                                : '#0E4D5C',
                          }}
                        >
                          {c.categoria === 'Alimentação' ? (
                            <Utensils className="w-4 h-4" />
                          ) : c.categoria === 'Smart Living' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                        </div>

                        {/* Title & Preview */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                              {c.titulo}
                            </span>
                            {!c.lidoPeloUsuario && (
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: '#F27059' }}
                              />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {c.categoria} · {c.dataEnvio.split(' ')[0]}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {c.conteudo}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Events List Tab */
              <div className="space-y-2.5">
                {eventos.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                        {e.tipo}
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">{e.data}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{e.titulo}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{e.descricao}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-100">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {e.horarioInicio} às {e.horarioFim} · {e.local}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: INÍCIO ================= */}
        {!modoCoordenacaoMobile && activeTab === 'inicio' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Student Daily Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white"
                    style={{ backgroundColor: '#0E4D5C' }}
                  >
                    {activeAluno.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{activeAluno.nome}</h2>
                    <p className="text-[11px] text-slate-500">{activeAluno.turmaNome}</p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Na Escola
                </span>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <div className="text-[10px] text-slate-400">Horário Oficial</div>
                  <div className="font-mono font-bold text-slate-800">
                    {activeAluno.horarioEntrada} - {activeAluno.horarioSaida}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <div className="text-[10px] text-slate-400">Turno & Contrato</div>
                  <div className="font-bold text-teal-800">Período {activeAluno.periodo}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('rotina')}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-left space-y-1.5 shadow-2xs active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Cardápio & Almoço</div>
                <div className="text-[10px] text-slate-500">Refeições de hoje</div>
              </button>

              <button
                onClick={() => setChatAberto(true)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-left space-y-1.5 shadow-2xs active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FDEEEB', color: '#F27059' }}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Falar c/ Professores</div>
                <div className="text-[10px] text-slate-500">Canal direto</div>
              </button>
            </div>

            {/* Recent Announcement Highlight */}
            {comunicados.length > 0 && (
              <div
                onClick={() => {
                  setComunicadoAberto(comunicados[0]);
                  setActiveTab('comunicacao');
                }}
                className="bg-white p-4 rounded-2xl border border-teal-200/70 shadow-2xs space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-800">Último Comunicado</span>
                  <span className="text-slate-400">{comunicados[0].dataEnvio.split(' ')[0]}</span>
                </div>
                <div className="text-xs font-bold text-slate-900">{comunicados[0].titulo}</div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{comunicados[0].conteudo}</p>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: FINANCEIRO ================= */}
        {!modoCoordenacaoMobile && activeTab === 'financeiro' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-slate-900">Mensalidades do Aluno</div>

            <div className="space-y-3">
              {titulos
                .filter((t) => t.alunoId === activeAluno.id)
                .map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Competência {t.competencia}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.situacao === 'Paga'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {t.situacao}
                      </span>
                    </div>

                    <div className="text-lg font-bold font-mono text-slate-900">
                      {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>
                        Vencimento: <strong>{t.vencimento}</strong>
                      </span>
                      <button
                        onClick={() => setTituloAberto(t)}
                        className="font-bold text-teal-800 underline cursor-pointer"
                      >
                        Visualizar Código
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= SCREEN: ROTINA & VIDA ESCOLAR ================= */}
        {!modoCoordenacaoMobile && activeTab === 'rotina' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="text-xs font-bold text-slate-900">Consolidação de Horários</div>
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Entrada Oficial:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {activeAluno.horarioEntrada}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Saída Oficial:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {activeAluno.horarioSaida}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-teal-200">
                  <span className="text-teal-900 font-semibold">Carga Horária Contratada:</span>
                  <span className="font-bold text-teal-900">
                    {activeAluno.periodo === 'Integral' ? '11h / dia (Integral)' : 'Meio período'}
                  </span>
                </div>
              </div>
            </div>

            {/* Alimentação */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Serviços de Alimentação</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {activeAluno.almoco
                  ? 'Colação da manhã (09h30) e Almoço supervisionado (11h45) inclusos.'
                  : 'Colação matutina inclusa.'}
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                <strong>Restrições Médicas/Alergias: </strong>
                {activeAluno.restricoesAlimentares && activeAluno.restricoesAlimentares.length > 0
                  ? activeAluno.restricoesAlimentares.join(', ')
                  : 'Nenhuma restrição alimentar cadastrada.'}
              </div>
            </div>

            {/* Smart Living */}
            {activeAluno.smartLiving && (
              <div className="bg-white p-4 rounded-2xl border border-coral-200/80 shadow-2xs space-y-2">
                <div className="text-xs font-bold text-coral-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-coral-600" />
                  <span>Oficinas Smart Living (Contraturno)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeAluno.smartLivingModalidades?.map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-coral-50 text-coral-900 text-xs font-medium rounded-lg border border-coral-200/70"
                    >
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREEN: MAIS (MENU) ================= */}
        {!modoCoordenacaoMobile && activeTab === 'mais' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
              <button
                onClick={() => setShowKidSwitcher(true)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-800" />
                  <span className="font-semibold text-slate-800">Trocar Filho / Aluno</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Toggle to Mobile Staff Mode */}
              <button
                onClick={() => setModoCoordenacaoMobile(true)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-teal-800" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Modo Equipe / Coordenação no Celular
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Visualizar chamada, alertas e rotina docente
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Full Desktop Web App switch */}
              <button
                onClick={() => {
                  setIsMobileDevicePreview(false);
                  setActiveModule('admin');
                }}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Abrir Painel Administrativo Desktop
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Tabelas completas e relatórios em tela cheia
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setShowStorytelling(true)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-800">Storytelling para a Jully</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setShowSponteDocs(true)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-slate-800">
                    Arquitetura de Integração Sponte
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-4 text-center text-[11px] text-slate-400 space-y-1">
              <p>Colégio Estação do Aprender · Niterói/RJ</p>
              <p className="font-medium text-slate-600">
                Tecnologia desenvolvida por Consult Services
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Floating Action Bubble + Attached Teaser Balloon (Matching User Attachment EXACTLY!) */}
      {activeTab === 'comunicacao' && !chatAberto && !modoCoordenacaoMobile && (
        <div className="absolute bottom-20 right-3 z-30 flex items-end gap-2 pointer-events-auto">
          {/* Attached floating speech balloon */}
          {showFloatingTeaser && (
            <div
              onClick={() => setChatAberto(true)}
              className="bg-white p-3 rounded-2xl shadow-xl border border-teal-100 flex items-start gap-2 max-w-[215px] cursor-pointer hover:border-teal-300 transition-all active:scale-[0.98] animate-in slide-in-from-right duration-200 relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFloatingTeaser(false);
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 text-white flex items-center justify-center text-[10px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>

              <div className="relative shrink-0 mt-0.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: '#0E4D5C' }}
                >
                  BD
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                  <span>Profª. Beatriz</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">· online</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Bom dia! Sofia adorou a atividade bilíngue hoje. Alguma dúvida?
                </p>
              </div>
            </div>
          )}

          {/* Floating Circle Action Button */}
          <button
            onClick={() => setChatAberto(true)}
            className="w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            style={{ backgroundColor: '#0E4D5C' }}
            title="Abrir Chat com Professora"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 4. Docked Mobile Bottom Tab Bar (Matching Attachment 5-tab layout) */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 grid grid-cols-5 items-center h-16 px-1 shadow-lg">
        {[
          { id: 'inicio', label: 'Início', icon: Home },
          { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
          {
            id: 'comunicacao',
            label: 'Comunicação',
            icon: MessageSquare,
            badge: unreadCount > 0 ? unreadCount : undefined,
          },
          { id: 'rotina', label: 'Rotina', icon: Clock },
          { id: 'mais', label: 'Menu', icon: Menu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setModoCoordenacaoMobile(false);
                setActiveTab(tab.id as MobileTab);
              }}
              className={`flex flex-col items-center justify-center h-full relative cursor-pointer transition-colors ${
                isActive ? 'text-teal-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              style={{ color: isActive ? '#0E4D5C' : undefined }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span
                    className="absolute -top-1 -right-2.5 w-4 h-4 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: '#F27059' }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 5. Interactive Chat Drawer (Like the floating bubble in user attachment) */}
      {chatAberto && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in slide-in-from-bottom duration-200">
          {/* Chat Header */}
          <div
            className="p-4 text-white flex items-center justify-between shrink-0 shadow-xs"
            style={{ backgroundColor: '#0E4D5C' }}
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setChatAberto(false)}
                className="p-1 text-teal-200 hover:text-white rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Profª. Beatriz Duarte & Coordenação</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-teal-200">
                  Colégio Estação do Aprender · Resposta ágil
                </div>
              </div>
            </div>

            <button
              onClick={() => setChatAberto(false)}
              className="p-1 text-teal-200 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.ehEscola ? 'items-start' : 'items-end'}`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.remetente}</span>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.ehEscola
                      ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                      : 'text-white rounded-tr-xs'
                  }`}
                  style={{
                    backgroundColor: msg.ehEscola ? '#FFFFFF' : '#0E4D5C',
                  }}
                >
                  {msg.texto}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.hora}</span>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Digite sua mensagem para a coordenação..."
              value={novaMsg}
              onChange={(e) => setNovaMsg(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-full text-xs focus:outline-teal-700"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
              style={{ backgroundColor: '#0E4D5C' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 6. Modal: Contatos Escolares Bottom Sheet */}
      {modalContatosEscolares && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Contatos Escolares Oficiais</h3>
                <p className="text-[11px] text-slate-400">Canais diretos de atendimento</p>
              </div>
              <button
                onClick={() => setModalContatosEscolares(false)}
                className="text-slate-400 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div
                onClick={() => {
                  setModalContatosEscolares(false);
                  setChatAberto(true);
                }}
                className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-teal-100/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
                    CP
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Coordenação Pedagógica</div>
                    <div className="text-[11px] text-slate-500">Profª. Beatriz Duarte</div>
                  </div>
                </div>
                <span className="text-teal-800 font-bold text-[11px]">Conversar →</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold">
                    SE
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Secretaria Escolar</div>
                    <div className="text-[11px] text-slate-500">Matrículas e declarações</div>
                  </div>
                </div>
                <span className="text-slate-600 font-mono text-[11px]">(21) 3600-0000</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    NU
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Nutrição & Cardápio</div>
                    <div className="text-[11px] text-slate-500">Nutricionista responsável</div>
                  </div>
                </div>
                <span className="text-slate-600 text-[11px]">Ativo no horário</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Grupos Bottom Sheet */}
      {modalGrupos && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Grupos da Comunidade Escolar</h3>
                <p className="text-[11px] text-slate-400">Turmas e oficinas</p>
              </div>
              <button
                onClick={() => setModalGrupos(false)}
                className="text-slate-400 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-700" />
                  <div>
                    <div className="font-bold text-slate-900">Turma Toddler A (Bilingual)</div>
                    <div className="text-[11px] text-slate-500">22 famílias participantes</div>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">
                  Ativo
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-coral-600" />
                  <div>
                    <div className="font-bold text-slate-900">Clube de Robótica Smart Living</div>
                    <div className="text-[11px] text-slate-500">Oficinas do contraturno</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">Quartas 16h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Announcement Reading Modal */}
      {comunicadoAberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {comunicadoAberto.categoria}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                  {comunicadoAberto.titulo}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {comunicadoAberto.dataEnvio} · {comunicadoAberto.autorNome}
                </span>
              </div>
              <button
                onClick={() => setComunicadoAberto(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {comunicadoAberto.conteudo}
            </p>

            {comunicadoAberto.anexoNome && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{comunicadoAberto.anexoNome}</span>
                <span className="text-teal-800 font-bold">PDF</span>
              </div>
            )}

            <button
              onClick={() => setComunicadoAberto(null)}
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer shadow-xs"
              style={{ backgroundColor: '#0E4D5C' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* 9. Student Switcher Bottom Sheet */}
      {showKidSwitcher && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Selecione o Aluno</h3>
              <button
                onClick={() => setShowKidSwitcher(false)}
                className="text-slate-400 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {alunosVinculados.map((kid) => (
                <div
                  key={kid.id}
                  onClick={() => {
                    setActiveAluno(kid);
                    setShowKidSwitcher(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    kid.id === activeAluno.id
                      ? 'border-teal-700 bg-teal-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: '#0E4D5C' }}
                    >
                      {kid.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{kid.nome}</div>
                      <div className="text-[11px] text-slate-500">{kid.turmaNome}</div>
                    </div>
                  </div>
                  {kid.id === activeAluno.id && (
                    <CheckCircle2 className="w-5 h-5 text-teal-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Financial Slip Modal */}
      {tituloAberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Título Financeiro · {tituloAberto.competencia}
              </h3>
              <button
                onClick={() => setTituloAberto(null)}
                className="text-slate-400 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Demonstrativo:</span>
                <span className="font-mono font-bold text-slate-900">
                  {tituloAberto.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vencimento:</span>
                <span className="font-semibold text-slate-800">{tituloAberto.vencimento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Linha Digitável (Simulada):</span>
              </div>
              <p className="font-mono text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200 break-all select-all">
                {tituloAberto.linhaDigitavelDemonstrativa || tituloAberto.codigoBarrasDemonstrativo}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    tituloAberto.linhaDigitavelDemonstrativa || tituloAberto.codigoBarrasDemonstrativo
                  );
                  setCopiado(true);
                  setTimeout(() => setCopiado(false), 2000);
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: '#0E4D5C' }}
              >
                {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiado ? 'Código Copiado!' : 'Copiar Código'}</span>
              </button>
              <button
                onClick={() => setTituloAberto(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
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
