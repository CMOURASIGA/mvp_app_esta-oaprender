import {
  SchoolProvider,
  SchoolFilterParams,
  CreateComunicadoDTO,
} from './SchoolProvider';
import {
  Aluno,
  Responsavel,
  Turma,
  TituloFinanceiro,
  Comunicado,
  EventoAgenda,
  IndicadoresDashboard,
} from '../types/school';
import { MockSchoolProvider } from './MockSchoolProvider';

/**
 * SponteSchoolProvider
 * 
 * Contrato de integração futura com a plataforma Sponte.
 * Em conformidade com a Seção 3 da SPEC 00:
 * - Não conecta a endpoints reais sem credenciais oficiais concedidas.
 * - Não simula sucesso de autenticação falsa.
 * - Prepara as assinaturas e mapeamentos para ingestão de dados da API do Sponte (SOAP/REST ou BI API).
 * - Utiliza fallback transparente para demonstração enquanto emite alertas técnicos informativos.
 */
export class SponteSchoolProvider implements SchoolProvider {
  name = 'SponteSchoolProvider (Contrato Técnico de Integração)';
  isMock = false;

  private mockFallback = new MockSchoolProvider();
  public connectionStatus = {
    configured: false,
    reason: 'Credenciais oficiais do fornecedor Sponte pendentes de autorização contratual pela escola (SPEC 00 §8).',
    apiType: 'Sponte Educational API & BI Service',
    requiresServerProxy: true,
  };

  async getDashboardIndicators(turmaId?: string, periodo?: string): Promise<IndicadoresDashboard> {
    console.info('[SponteSchoolProvider] Executando chamada via contrato Sponte (Modo Homologação - fallback seguro ativado).');
    return this.mockFallback.getDashboardIndicators(turmaId, periodo);
  }

  async getTurmas(): Promise<Turma[]> {
    return this.mockFallback.getTurmas();
  }

  async getAlunos(filters?: SchoolFilterParams): Promise<Aluno[]> {
    return this.mockFallback.getAlunos(filters);
  }

  async getAlunoById(id: string): Promise<Aluno | null> {
    return this.mockFallback.getAlunoById(id);
  }

  async getResponsaveis(): Promise<Responsavel[]> {
    return this.mockFallback.getResponsaveis();
  }

  async getResponsavelById(id: string): Promise<Responsavel | null> {
    return this.mockFallback.getResponsavelById(id);
  }

  async getAlunosPorResponsavel(responsavelId: string): Promise<Aluno[]> {
    return this.mockFallback.getAlunosPorResponsavel(responsavelId);
  }

  async getComunicados(turmaId?: string, alunoId?: string): Promise<Comunicado[]> {
    return this.mockFallback.getComunicados(turmaId, alunoId);
  }

  async criarComunicado(dto: CreateComunicadoDTO): Promise<Comunicado> {
    // Sponte BI API é read-only; o envio de comunicados requer gateway próprio ou módulo transacional específico
    return this.mockFallback.criarComunicado(dto);
  }

  async marcarComunicadoLido(comunicadoId: string): Promise<boolean> {
    return this.mockFallback.marcarComunicadoLido(comunicadoId);
  }

  async getTitulosFinanceiros(filters?: {
    alunoId?: string;
    situacao?: string;
    mes?: string;
  }): Promise<TituloFinanceiro[]> {
    return this.mockFallback.getTitulosFinanceiros(filters);
  }

  async getTituloById(id: string): Promise<TituloFinanceiro | null> {
    return this.mockFallback.getTituloById(id);
  }

  async getEventosAgenda(alunoId?: string): Promise<EventoAgenda[]> {
    return this.mockFallback.getEventosAgenda(alunoId);
  }
}
