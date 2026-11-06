import {
  Aluno,
  Responsavel,
  Turma,
  TituloFinanceiro,
  Comunicado,
  EventoAgenda,
  IndicadoresDashboard,
  PeriodoEscolar,
} from '../types/school';

export interface SchoolFilterParams {
  turmaId?: string;
  periodo?: PeriodoEscolar | 'TODOS';
  busca?: string;
  smartLivingApenas?: boolean;
  almocoApenas?: boolean;
}

export interface CreateComunicadoDTO {
  titulo: string;
  conteudo: string;
  categoria: Comunicado['categoria'];
  turmaDestinoId: string;
  autorNome: string;
  anexoNome?: string;
}

export interface SchoolProvider {
  name: string;
  isMock: boolean;

  // Indicadores
  getDashboardIndicators(turmaId?: string, periodo?: string): Promise<IndicadoresDashboard>;

  // Acadêmico
  getTurmas(): Promise<Turma[]>;
  getAlunos(filters?: SchoolFilterParams): Promise<Aluno[]>;
  getAlunoById(id: string): Promise<Aluno | null>;

  // Responsáveis & Família
  getResponsaveis(): Promise<Responsavel[]>;
  getResponsavelById(id: string): Promise<Responsavel | null>;
  getAlunosPorResponsavel(responsavelId: string): Promise<Aluno[]>;

  // Comunicação (com sincronização em tempo real na sessão)
  getComunicados(turmaId?: string, alunoId?: string): Promise<Comunicado[]>;
  criarComunicado(dto: CreateComunicadoDTO): Promise<Comunicado>;
  marcarComunicadoLido(comunicadoId: string): Promise<boolean>;

  // Financeiro
  getTitulosFinanceiros(filters?: { alunoId?: string; situacao?: string; mes?: string }): Promise<TituloFinanceiro[]>;
  getTituloById(id: string): Promise<TituloFinanceiro | null>;

  // Agenda
  getEventosAgenda(alunoId?: string): Promise<EventoAgenda[]>;
}
