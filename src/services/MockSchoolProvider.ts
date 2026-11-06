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
import {
  INITIAL_ALUNOS,
  INITIAL_TURMAS,
  INITIAL_RESPONSAVEIS,
  INITIAL_COMUNICADOS,
  INITIAL_EVENTOS,
  INITIAL_TITULOS,
  INITIAL_DASHBOARD_INDICATORS,
} from '../data/mockData';

const STORAGE_KEYS = {
  COMUNICADOS: 'ea_mock_comunicados_v1',
  ALUNOS: 'ea_mock_alunos_v1',
};

let memoryComunicados: Comunicado[] = [...INITIAL_COMUNICADOS];

function getStoredComunicados(): Comunicado[] {
  if (typeof window === 'undefined') return memoryComunicados;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.COMUNICADOS);
    if (!raw) return memoryComunicados;
    return JSON.parse(raw);
  } catch {
    return memoryComunicados;
  }
}

function saveStoredComunicados(list: Comunicado[]) {
  memoryComunicados = list;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.COMUNICADOS, JSON.stringify(list));
  } catch (e) {
    console.warn('Erro ao salvar comunicados na sessão:', e);
  }
}

export class MockSchoolProvider implements SchoolProvider {
  name = 'MockSchoolProvider (Dados Demonstrativos)';
  isMock = true;

  async getDashboardIndicators(turmaId?: string, periodo?: string): Promise<IndicadoresDashboard> {
    const comunicados = getStoredComunicados();
    let alunos = [...INITIAL_ALUNOS];

    if (turmaId && turmaId !== 'TODAS') {
      alunos = alunos.filter((a) => a.turmaId === turmaId);
    }
    if (periodo && periodo !== 'TODOS') {
      alunos = alunos.filter((a) => a.periodo === periodo);
    }

    const distPeriodo = {
      Manhã: 0,
      Tarde: 0,
      Integral: 0,
      Intermediário: 0,
    };
    const contratosSituacao = {
      Ativa: 0,
      'Em Renovação': 0,
      Trancada: 0,
      Pendente: 0,
    };

    alunos.forEach((a) => {
      distPeriodo[a.periodo] = (distPeriodo[a.periodo] || 0) + 1;
      contratosSituacao[a.situacao] = (contratosSituacao[a.situacao] || 0) + 1;
    });

    return {
      ...INITIAL_DASHBOARD_INDICATORS,
      matriculasAtivas: alunos.length,
      distribuicaoPeriodo: distPeriodo,
      contratosPorSituacao: contratosSituacao,
      totalComunicadosEmitidos: comunicados.length + 23,
    };
  }

  async getTurmas(): Promise<Turma[]> {
    return [...INITIAL_TURMAS];
  }

  async getAlunos(filters?: SchoolFilterParams): Promise<Aluno[]> {
    let list = [...INITIAL_ALUNOS];

    if (filters?.turmaId && filters.turmaId !== 'TODAS') {
      list = list.filter((a) => a.turmaId === filters.turmaId);
    }
    if (filters?.periodo && filters.periodo !== 'TODOS') {
      list = list.filter((a) => a.periodo === filters.periodo);
    }
    if (filters?.smartLivingApenas) {
      list = list.filter((a) => a.smartLiving);
    }
    if (filters?.almocoApenas) {
      list = list.filter((a) => a.almoco);
    }
    if (filters?.busca && filters.busca.trim() !== '') {
      const q = filters.busca.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.nome.toLowerCase().includes(q) ||
          a.matricula.toLowerCase().includes(q) ||
          a.turmaNome.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async getAlunoById(id: string): Promise<Aluno | null> {
    const aluno = INITIAL_ALUNOS.find((a) => a.id === id);
    return aluno || null;
  }

  async getResponsaveis(): Promise<Responsavel[]> {
    return [...INITIAL_RESPONSAVEIS];
  }

  async getResponsavelById(id: string): Promise<Responsavel | null> {
    const resp = INITIAL_RESPONSAVEIS.find((r) => r.id === id);
    return resp || null;
  }

  async getAlunosPorResponsavel(responsavelId: string): Promise<Aluno[]> {
    const resp = INITIAL_RESPONSAVEIS.find((r) => r.id === responsavelId);
    if (!resp) return [];
    return INITIAL_ALUNOS.filter((a) => resp.alunosVinculadosIds.includes(a.id));
  }

  async getComunicados(turmaId?: string, alunoId?: string, responsavelId?: string): Promise<Comunicado[]> {
    let list = getStoredComunicados();

    if (alunoId) {
      const aluno = INITIAL_ALUNOS.find((a) => a.id === alunoId);
      if (aluno) {
        list = list.filter(
          (c) => c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === aluno.turmaId
        );
      }
    } else if (turmaId && turmaId !== 'TODAS') {
      list = list.filter((c) => c.turmaDestinoId === 'TODAS' || c.turmaDestinoId === turmaId);
    }

    // Map individual read status for the specific viewing responsavel
    return list.map((c) => ({
      ...c,
      lidosPorResponsaveisIds: c.lidosPorResponsaveisIds || [],
      lidoPeloUsuario: responsavelId
        ? (c.lidosPorResponsaveisIds || []).includes(responsavelId)
        : !!c.lidoPeloUsuario,
    }));
  }

  async criarComunicado(dto: CreateComunicadoDTO): Promise<Comunicado> {
    const list = getStoredComunicados();
    const turma = INITIAL_TURMAS.find((t) => t.id === dto.turmaDestinoId);
    const turmaNome = dto.turmaDestinoId === 'TODAS' ? 'Todas as Turmas' : (turma?.nome || 'Turma Selecionada');

    const totalDest = dto.turmaDestinoId === 'TODAS' ? 159 : (turma?.totalAlunos || 20);

    const novo: Comunicado = {
      id: `com-${Date.now()}`,
      titulo: dto.titulo,
      conteudo: dto.conteudo,
      dataEnvio: new Date().toISOString().replace('T', ' ').substring(0, 16),
      autorNome: dto.autorNome || 'Coordenação Escolar',
      categoria: dto.categoria,
      turmaDestinoId: dto.turmaDestinoId,
      turmaDestinoNome: turmaNome,
      anexoNome: dto.anexoNome,
      anexoTamanho: dto.anexoNome ? '1.2 MB' : undefined,
      destinatariosTotal: totalDest,
      leiturasConfirmadas: 0,
      lidosPorResponsaveisIds: [],
      lidoPeloUsuario: false,
    };

    const updated = [novo, ...list];
    saveStoredComunicados(updated);
    return novo;
  }

  async marcarComunicadoLido(comunicadoId: string, responsavelId: string): Promise<boolean> {
    const list = getStoredComunicados();
    const idx = list.findIndex((c) => c.id === comunicadoId);
    if (idx === -1) return false;

    const currentLidos = list[idx].lidosPorResponsaveisIds || [];
    if (!currentLidos.includes(responsavelId)) {
      const updatedLidos = [...currentLidos, responsavelId];
      list[idx] = {
        ...list[idx],
        lidosPorResponsaveisIds: updatedLidos,
        leiturasConfirmadas: list[idx].leiturasConfirmadas + 1,
        lidoPeloUsuario: true,
      };
      saveStoredComunicados(list);
    }
    return true;
  }

  async getTitulosFinanceiros(filters?: {
    alunoId?: string;
    situacao?: string;
    mes?: string;
  }): Promise<TituloFinanceiro[]> {
    let list = [...INITIAL_TITULOS];

    if (filters?.alunoId) {
      list = list.filter((t) => t.alunoId === filters.alunoId);
    }
    if (filters?.situacao && filters.situacao !== 'TODAS') {
      list = list.filter((t) => t.situacao === filters.situacao);
    }
    if (filters?.mes && filters.mes !== 'TODOS') {
      list = list.filter((t) => t.competencia === filters.mes);
    }

    return list;
  }

  async getTituloById(id: string): Promise<TituloFinanceiro | null> {
    const t = INITIAL_TITULOS.find((item) => item.id === id);
    return t || null;
  }

  async getEventosAgenda(alunoId?: string): Promise<EventoAgenda[]> {
    let list = [...INITIAL_EVENTOS];
    if (alunoId) {
      const aluno = INITIAL_ALUNOS.find((a) => a.id === alunoId);
      if (aluno) {
        list = list.filter(
          (e) => e.turmasIds.includes('TODAS') || e.turmasIds.includes(aluno.turmaId)
        );
      }
    }
    return list;
  }
}
