import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CategoriaComunicado, Comunicado } from '../../types/school';
import {
  MessageSquare,
  Plus,
  Send,
  Users,
  CheckCircle2,
  Paperclip,
  Clock,
  Filter,
  Check,
  Sparkles,
  Eye,
  FileText,
} from 'lucide-react';

export const CommunicationManagement: React.FC = () => {
  const { comunicados, turmas, publicarComunicado, setActiveModule, setFamilySection } = useSchool();

  const [novoAberto, setNovoAberto] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Form states
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaComunicado>('Geral');
  const [turmaDestinoId, setTurmaDestinoId] = useState('TODAS');
  const [anexoNome, setAnexoNome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) {
      alert('Por favor, preencha o título e o conteúdo do comunicado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const novo = await publicarComunicado({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        categoria,
        turmaDestinoId,
        autorNome: 'Coordenação Escolar',
        anexoNome: anexoNome.trim() || undefined,
      });

      setSucessoMsg(
        `Comunicado "${novo.titulo}" publicado com sucesso! Ele já está visível no Portal da Família.`
      );
      setNovoAberto(false);
      setTitulo('');
      setConteudo('');
      setAnexoNome('');
    } catch (err) {
      console.error(err);
      alert('Erro ao publicar comunicado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComunicados = comunicados.filter((c) => {
    return filtroCategoria === 'TODAS' || c.categoria === filtroCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800" style={{ color: '#0E4D5C' }}>
            <MessageSquare className="w-4 h-4" />
            <span>Módulo A4 · Central de Comunicação Escolar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Comunicados & Avisos Institucionais
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Emissão de comunicados segmentados por turma com sincronização instantânea com o Portal da Família na sessão.
          </p>
        </div>

        <button
          onClick={() => {
            setNovoAberto(!novoAberto);
            setSucessoMsg(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ backgroundColor: novoAberto ? '#475569' : '#F27059' }}
        >
          {novoAberto ? (
            <span>Fechar Formulário</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Novo Comunicado</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Bar */}
      {sucessoMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sucessoMsg}</span>
          </div>
          <button
            onClick={() => {
              setActiveModule('family');
              setFamilySection('comunicados');
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
          >
            Abrir Portal da Família para Conferir →
          </button>
        </div>
      )}

      {/* Form: Criar Comunicado Fictício (SPEC A4) */}
      {novoAberto && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-600/30 shadow-md space-y-5 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-coral-600" style={{ color: '#F27059' }} />
              <h2 className="text-base font-bold text-slate-900">
                Elaborar Novo Comunicado Escolar
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Disponível em tempo real na sessão
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Título */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Título do Comunicado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Convite para o Festival de Primavera & English Day 2026"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-teal-600 focus:bg-white"
                />
              </div>

              {/* Público Alvo / Turma Destino */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Público-Alvo / Turma Destino *</span>
                </label>
                <select
                  value={turmaDestinoId}
                  onChange={(e) => setTurmaDestinoId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-teal-600"
                >
                  <option value="TODAS">Todas as Turmas do Colégio (Geral)</option>
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} ({t.segmento})
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Categoria da Mensagem *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as CategoriaComunicado)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-teal-600"
                >
                  <option value="Geral">Geral</option>
                  <option value="Pedagógico">Pedagógico</option>
                  <option value="Alimentação">Alimentação & Cardápio</option>
                  <option value="Smart Living">Smart Living (Contraturno)</option>
                  <option value="Evento">Evento Escolar</option>
                  <option value="Urgente">Aviso Urgente</option>
                </select>
              </div>

              {/* Anexo Fictício */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nome do Anexo (Demonstrativo, ex: circular_informativa.pdf)</span>
                </label>
                <input
                  type="text"
                  placeholder="circular_informativa_abril.pdf (opcional)"
                  value={anexoNome}
                  onChange={(e) => setAnexoNome(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-teal-600 focus:bg-white"
                />
              </div>

              {/* Conteúdo */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Conteúdo da Mensagem *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva as orientações para as famílias..."
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-teal-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Nenhum e-mail ou SMS real será disparado. Sincronização exclusiva da sessão.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNovoAberto(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: '#0E4D5C' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar Comunicado'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Filtrar por Categoria:</span>
          <div className="flex flex-wrap gap-1">
            {['TODAS', 'Geral', 'Pedagógico', 'Alimentação', 'Smart Living', 'Evento'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filtroCategoria === cat
                    ? 'bg-teal-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'TODAS' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          {filteredComunicados.length} comunicados registrados
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredComunicados.map((c) => {
          const taxaLeitura = Math.round((c.leiturasConfirmadas / c.destinatariosTotal) * 100);

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.categoria === 'Urgente'
                        ? 'bg-rose-100 text-rose-800'
                        : c.categoria === 'Smart Living'
                        ? 'bg-coral-100 text-coral-800'
                        : c.categoria === 'Alimentação'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-teal-50 text-teal-800 border border-teal-200/60'
                    }`}
                  >
                    {c.categoria}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Para: <strong>{c.turmaDestinoNome}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.dataEnvio}</span>
                  </span>
                  <span>·</span>
                  <span>Por: {c.autorNome}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{c.titulo}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.conteudo}</p>
              </div>

              {c.anexoNome && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <Paperclip className="w-3.5 h-3.5 text-teal-700" />
                  <span className="font-medium">{c.anexoNome}</span>
                  {c.anexoTamanho && <span className="text-slate-400">({c.anexoTamanho})</span>}
                </div>
              )}

              {/* Read Confirmation Stats (SPEC A4) */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>Confirmações de Leitura:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-700 rounded-full"
                        style={{ width: `${Math.min(taxaLeitura, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {c.leiturasConfirmadas} / {c.destinatariosTotal} ({taxaLeitura}%)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  ID: <span className="font-mono">{c.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
