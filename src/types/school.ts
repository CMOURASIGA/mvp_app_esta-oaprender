export type PeriodoEscolar = 'Manhã' | 'Tarde' | 'Integral' | 'Intermediário';

export type SituacaoMatricula = 'Ativa' | 'Em Renovação' | 'Trancada' | 'Pendente';

export type SituacaoFinanceira = 'Paga' | 'A vencer' | 'Vencida' | 'Cancelada';

export type CategoriaComunicado = 'Geral' | 'Pedagógico' | 'Alimentação' | 'Smart Living' | 'Evento' | 'Urgente';

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  turmaId: string;
  turmaNome: string;
  serie: string;
  anoLetivo: number;
  periodo: PeriodoEscolar;
  horarioEntrada: string;
  horarioSaida: string;
  colacao: boolean;
  almoco: boolean;
  smartLiving: boolean;
  smartLivingModalidades?: string[];
  situacao: SituacaoMatricula;
  responsavelId: string;
  restricoesAlimentares?: string[];
  fotoUrl?: string;
  dataNascimento: string;
  frequenciaPercentual: number;
  diasLetivosTotal: number;
  presencasContabilizadas: number;
  observacoesPedagogicas?: string;
}

export interface Responsavel {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  parentesco: string;
  alunosVinculadosIds: string[];
  fotoUrl?: string;
}

export interface Turma {
  id: string;
  nome: string;
  segmento: 'Educação Infantil' | 'Ensino Fundamental I' | 'Ensino Fundamental II';
  periodo: PeriodoEscolar;
  sala: string;
  capacidade: number;
  totalAlunos: number;
  professorRegente: string;
}

export interface TituloFinanceiro {
  id: string;
  alunoId: string;
  alunoNome: string;
  responsavelId: string;
  competencia: string; // ex: '03/2026'
  vencimento: string; // '2026-03-10'
  valor: number;
  descontoPontualidade?: number;
  situacao: SituacaoFinanceira;
  dataPagamento?: string;
  codigoBarrasDemonstrativo: string;
  linhaDigitavelDemonstrativa: string;
  servicosDescricao: string[];
}

export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  dataEnvio: string;
  autorNome: string;
  categoria: CategoriaComunicado;
  turmaDestinoId: string; // 'TODAS' ou id da turma
  turmaDestinoNome: string;
  anexoNome?: string;
  anexoTamanho?: string;
  destinatariosTotal: number;
  leiturasConfirmadas: number;
  lidoPeloUsuario?: boolean;
}

export interface EventoAgenda {
  id: string;
  titulo: string;
  descricao: string;
  data: string; // YYYY-MM-DD
  horarioInicio: string;
  horarioFim: string;
  local: string;
  tipo: 'Evento Escolar' | 'Reunião' | 'Atividade Bilíngue' | 'Feriado / Recesso';
  turmasIds: string[]; // ['TODAS'] ou turmas
  comunicadoVinculadoId?: string;
}

export interface IndicadoresDashboard {
  matriculasAtivas: number;
  capacidadeTotal: number;
  taxaOcupacao: number;
  distribuicaoPeriodo: Record<PeriodoEscolar, number>;
  alunosPorTurma: { turma: string; total: number; capacidade: number }[];
  contratosPorSituacao: Record<SituacaoMatricula, number>;
  financeiro: {
    aVencerValor: number;
    aVencerQtd: number;
    vencidasValor: number;
    vencidasQtd: number;
    pagasValor: number;
    pagasQtd: number;
    totalEmAberto: number;
    taxaInadimplencia: number;
  };
  pendenciasAdministrativas: {
    id: string;
    tipo: 'Documento' | 'Atestado Médico' | 'Autorização' | 'Ficha Cadastral';
    descricao: string;
    alunoNome: string;
    turma: string;
    urgencia: 'Alta' | 'Média' | 'Baixa';
  }[];
  totalComunicadosEmitidos: number;
}
