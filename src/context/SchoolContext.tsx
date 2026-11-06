import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  getSchoolProvider,
  getCurrentProviderType,
  setSchoolProviderType,
  ProviderType,
  CreateComunicadoDTO,
} from '../services';

export type ActiveModule = 'admin' | 'family';
export type AdminSection = 'visao-geral' | 'academico' | 'financeiro' | 'comunicacao' | 'relatorios';
export type FamilySection = 'inicio' | 'agenda' | 'comunicados' | 'financeiro' | 'vida-escolar';

interface SchoolContextType {
  activeModule: ActiveModule;
  setActiveModule: (mod: ActiveModule) => void;
  adminSection: AdminSection;
  setAdminSection: (sec: AdminSection) => void;
  familySection: FamilySection;
  setFamilySection: (sec: FamilySection) => void;

  // Active Family Profile Switchers
  activeResponsavel: Responsavel | null;
  setActiveResponsavel: (resp: Responsavel) => void;
  activeAluno: Aluno | null;
  setActiveAluno: (aluno: Aluno) => void;
  alunosVinculados: Aluno[];

  // Entities
  responsaveis: Responsavel[];
  turmas: Turma[];
  alunos: Aluno[];
  comunicados: Comunicado[];
  eventos: EventoAgenda[];
  titulos: TituloFinanceiro[];
  indicadores: IndicadoresDashboard | null;
  isLoading: boolean;

  // Provider
  providerType: ProviderType;
  switchProvider: (type: ProviderType) => void;

  // Session-reactive actions
  publicarComunicado: (dto: CreateComunicadoDTO) => Promise<Comunicado>;
  marcarComoLido: (comunicadoId: string) => Promise<void>;
  recarregarDados: () => Promise<void>;

  // Documentation & Demo Modals
  showSponteDocs: boolean;
  setShowSponteDocs: (show: boolean) => void;
  showStorytelling: boolean;
  setShowStorytelling: (show: boolean) => void;
  showAcceptanceCriteria: boolean;
  setShowAcceptanceCriteria: (show: boolean) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('admin');
  const [adminSection, setAdminSection] = useState<AdminSection>('visao-geral');
  const [familySection, setFamilySection] = useState<FamilySection>('inicio');

  const [providerType, setProviderTypeState] = useState<ProviderType>(getCurrentProviderType());
  const [isLoading, setIsLoading] = useState(true);

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [activeResponsavel, setActiveResponsavelState] = useState<Responsavel | null>(null);
  const [alunosVinculados, setAlunosVinculados] = useState<Aluno[]>([]);
  const [activeAluno, setActiveAlunoState] = useState<Aluno | null>(null);

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [eventos, setEventos] = useState<EventoAgenda[]>([]);
  const [titulos, setTitulos] = useState<TituloFinanceiro[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadoresDashboard | null>(null);

  // Modals for SPEC compliance
  const [showSponteDocs, setShowSponteDocs] = useState(false);
  const [showStorytelling, setShowStorytelling] = useState(false);
  const [showAcceptanceCriteria, setShowAcceptanceCriteria] = useState(false);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    const provider = getSchoolProvider(providerType);
    try {
      const [allTurmas, allAlunos, allResponsaveis, allComunicados, allEventos, allTitulos, dashIndicators] =
        await Promise.all([
          provider.getTurmas(),
          provider.getAlunos(),
          provider.getResponsaveis(),
          provider.getComunicados(),
          provider.getEventosAgenda(),
          provider.getTitulosFinanceiros(),
          provider.getDashboardIndicators(),
        ]);

      setTurmas(allTurmas);
      setAlunos(allAlunos);
      setResponsaveis(allResponsaveis);
      setComunicados(allComunicados);
      setEventos(allEventos);
      setTitulos(allTitulos);
      setIndicadores(dashIndicators);

      // Default active responsavel & aluno if none chosen
      if (!activeResponsavel && allResponsaveis.length > 0) {
        const defaultResp = allResponsaveis[0]; // Mariana Vasconcellos (has 2 kids)
        setActiveResponsavelState(defaultResp);
        const kids = allAlunos.filter((a) => defaultResp.alunosVinculadosIds.includes(a.id));
        setAlunosVinculados(kids);
        if (kids.length > 0) {
          setActiveAlunoState(kids[0]);
        }
      } else if (activeResponsavel) {
        const kids = allAlunos.filter((a) => activeResponsavel.alunosVinculadosIds.includes(a.id));
        setAlunosVinculados(kids);
        if (activeAluno) {
          const updatedActive = kids.find((k) => k.id === activeAluno.id) || kids[0] || null;
          setActiveAlunoState(updatedActive);
        } else if (kids.length > 0) {
          setActiveAlunoState(kids[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do provedor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [providerType, activeResponsavel, activeAluno]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const setActiveResponsavel = (resp: Responsavel) => {
    setActiveResponsavelState(resp);
    const kids = alunos.filter((a) => resp.alunosVinculadosIds.includes(a.id));
    setAlunosVinculados(kids);
    if (kids.length > 0) {
      setActiveAlunoState(kids[0]);
    } else {
      setActiveAlunoState(null);
    }
  };

  const setActiveAluno = (aluno: Aluno) => {
    setActiveAlunoState(aluno);
  };

  const switchProvider = (type: ProviderType) => {
    setSchoolProviderType(type);
    setProviderTypeState(type);
  };

  const publicarComunicado = async (dto: CreateComunicadoDTO): Promise<Comunicado> => {
    const provider = getSchoolProvider(providerType);
    const novo = await provider.criarComunicado(dto);
    // Refresh comunicados and indicators immediately
    const updated = await provider.getComunicados();
    setComunicados(updated);
    const updatedInd = await provider.getDashboardIndicators();
    setIndicadores(updatedInd);
    return novo;
  };

  const marcarComoLido = async (comunicadoId: string): Promise<void> => {
    const provider = getSchoolProvider(providerType);
    await provider.marcarComunicadoLido(comunicadoId);
    setComunicados((prev) =>
      prev.map((c) =>
        c.id === comunicadoId
          ? { ...c, lidoPeloUsuario: true, leiturasConfirmadas: c.leiturasConfirmadas + 1 }
          : c
      )
    );
  };

  return (
    <SchoolContext.Provider
      value={{
        activeModule,
        setActiveModule,
        adminSection,
        setAdminSection,
        familySection,
        setFamilySection,
        activeResponsavel,
        setActiveResponsavel,
        activeAluno,
        setActiveAluno,
        alunosVinculados,
        responsaveis,
        turmas,
        alunos,
        comunicados,
        eventos,
        titulos,
        indicadores,
        isLoading,
        providerType,
        switchProvider,
        publicarComunicado,
        marcarComoLido,
        recarregarDados: carregarDados,
        showSponteDocs,
        setShowSponteDocs,
        showStorytelling,
        setShowStorytelling,
        showAcceptanceCriteria,
        setShowAcceptanceCriteria,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool deve ser utilizado dentro de um SchoolProviderComponent');
  }
  return context;
};
