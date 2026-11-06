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

/**
 * Erro emitido quando uma operação tenta consultar o provedor Sponte antes da liberação oficial.
 * Impede que dados fictícios sejam confundidos ou apresentados como integração ativa.
 */
export class SponteIntegrationUnavailableError extends Error {
  public readonly code = 'SPONTE_INTEGRATION_UNAVAILABLE';
  public readonly specRef = 'SPEC 00 §3 e §8';

  constructor(metodo?: string) {
    const action = metodo ? ` ao invocar '${metodo}'` : '';
    super(
      `[SponteSchoolProvider] Integração indisponível${action}. Conforme a Seção 3 e 8 da SPEC 00, o contrato de integração com a API Sponte aguarda formalização do termo de autorização e liberação das credenciais oficiais pelo fornecedor. Para preservar a integridade dos dados, nenhuma informação mockada é apresentada sob a assinatura da integração oficial.`
    );
    this.name = 'SponteIntegrationUnavailableError';
  }
}

/**
 * SponteSchoolProvider
 * 
 * Contrato técnico estruturado para futura integração com a plataforma Sponte.
 * Em estrita conformidade com a SPEC 00 (Seções 3 e 8):
 * - NÃO conecta a endpoints reais sem credenciais oficiais concedidas.
 * - NÃO simula sucesso de autenticação falsa.
 * - NÃO apresenta dados mockados como se fossem integração real.
 * - Mantém a integração em estado explicitamente INDISPONÍVEL até autorização contratual.
 */
export class SponteSchoolProvider implements SchoolProvider {
  public readonly name = 'SponteSchoolProvider (Contrato Técnico de Integração)';
  public readonly isMock = false;
  public readonly isAvailable = false;

  public readonly connectionStatus = {
    status: 'INDISPONIVEL' as const,
    autorizado: false,
    motivo: 'Credenciais oficiais do fornecedor Sponte pendentes de autorização contratual e concessão formal de chaves pela escola.',
    especificacao: 'SPEC 00 §3 e §8 - Consult Services Tecnologia',
    apiType: 'Sponte Educational API & BI Service (REST/SOAP)',
    requiresServerProxy: true,
  };

  /**
   * Diagnóstico do contrato técnico para auditoria e homologação (SPEC 00 §3 e §8).
   * Separa estritamente rotas oficiais da documentação do fornecedor Sponte
   * de contratos internos propostos pela Consult Services.
   */
  public getContractDiagnostics() {
    return {
      provider: this.name,
      status: this.connectionStatus.status,
      autorizacaoPendente: true,
      ambiente: 'Homologação Técnica',
      rotasOficiaisFornecedorSponte: [
        {
          servico: 'WSIntegracao.asmx / WS_Sponte.asmx (WSDL SOAP Oficial)',
          metodos: ['GetMatriculas', 'GetAlunos', 'GetFinanceiro', 'GetTurmas'],
          tipo: 'Especificação Oficial do Fornecedor Sponte',
          status: 'Oficialmente documentado / Aguarda contratação e credenciais da escola',
        },
        {
          servico: 'Sponte Educational BI API',
          metodos: ['GET /api/bi/alunos', 'GET /api/bi/financeiro/titulos', 'GET /api/bi/turmas'],
          tipo: 'Especificação Oficial do Fornecedor Sponte (Analytics)',
          status: 'Oficialmente documentado / Condicionado à ativação do módulo BI',
        },
      ],
      contratosInternosPropostosConsultServices: [
        {
          rotaInterna: '/api/v1/auth/token',
          finalidade: 'BFF Gateway: Autenticação Servidor-a-Servidor para não expor credenciais no cliente',
          tipo: 'Contrato Interno Proposto (Consult Services)',
        },
        {
          rotaInterna: '/api/v1/alunos',
          finalidade: 'Normalização REST JSON dos dados brutos SOAP e consolidação de horários/refeições',
          tipo: 'Contrato Interno Proposto (Consult Services)',
        },
        {
          rotaInterna: '/api/v1/financeiro/titulos',
          finalidade: 'Agregação de boletos e histórico de conciliação financeira',
          tipo: 'Contrato Interno Proposto (Consult Services)',
        },
        {
          rotaInterna: '/api/v1/comunicacao/disparos',
          finalidade: 'Gateway de mensageria da escola (Sponte não possui API aberta de push notifications)',
          tipo: 'Contrato Interno Proposto (Consult Services)',
        },
      ],
      diretrizDeSeguranca: 'Nenhum endpoint interno ou não verificado é apresentado como oficial do Sponte.',
    };
  }

  async getDashboardIndicators(_turmaId?: string, _periodo?: string): Promise<IndicadoresDashboard> {
    throw new SponteIntegrationUnavailableError('getDashboardIndicators');
  }

  async getTurmas(): Promise<Turma[]> {
    throw new SponteIntegrationUnavailableError('getTurmas');
  }

  async getAlunos(_filters?: SchoolFilterParams): Promise<Aluno[]> {
    throw new SponteIntegrationUnavailableError('getAlunos');
  }

  async getAlunoById(_id: string): Promise<Aluno | null> {
    throw new SponteIntegrationUnavailableError('getAlunoById');
  }

  async getResponsaveis(): Promise<Responsavel[]> {
    throw new SponteIntegrationUnavailableError('getResponsaveis');
  }

  async getResponsavelById(_id: string): Promise<Responsavel | null> {
    throw new SponteIntegrationUnavailableError('getResponsavelById');
  }

  async getAlunosPorResponsavel(_responsavelId: string): Promise<Aluno[]> {
    throw new SponteIntegrationUnavailableError('getAlunosPorResponsavel');
  }

  async getComunicados(_turmaId?: string, _alunoId?: string, _responsavelId?: string): Promise<Comunicado[]> {
    throw new SponteIntegrationUnavailableError('getComunicados');
  }

  async criarComunicado(_dto: CreateComunicadoDTO): Promise<Comunicado> {
    throw new SponteIntegrationUnavailableError('criarComunicado');
  }

  async marcarComunicadoLido(_comunicadoId: string, _responsavelId: string): Promise<boolean> {
    throw new SponteIntegrationUnavailableError('marcarComunicadoLido');
  }

  async getTitulosFinanceiros(_filters?: {
    alunoId?: string;
    situacao?: string;
    mes?: string;
  }): Promise<TituloFinanceiro[]> {
    throw new SponteIntegrationUnavailableError('getTitulosFinanceiros');
  }

  async getTituloById(_id: string): Promise<TituloFinanceiro | null> {
    throw new SponteIntegrationUnavailableError('getTituloById');
  }

  async getEventosAgenda(_alunoId?: string): Promise<EventoAgenda[]> {
    throw new SponteIntegrationUnavailableError('getEventosAgenda');
  }
}
