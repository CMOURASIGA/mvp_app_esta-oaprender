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
  isSponteUnavailable: boolean;

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
  isMobileDevicePreview: boolean;
  setIsMobileDevicePreview: (val: boolean) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('admin');
  const [adminSection, setAdminSection] = useState<AdminSection>('visao-geral');
  const [familySection, setFamilySection] = useState<FamilySection>('inicio');

  const [providerType, setProviderTypeState] = useState<ProviderType>(getCurrentProviderType());
  const [isLoading, setIsLoading] = useState(true);
  const [isSponteUnavailable, setIsSponteUnavailable] = useState(false);

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
  const [isMobileDevicePreview, setIsMobileDevicePreview] = useState(false);

  const activeResponsavelRef = React.useRef<Responsavel | null>(null);
  const activeAlunoRef = React.useRef<Aluno | null>(null);

  /**
   * Carrega os dados do provedor selecionado.
   * Depende EXCLUSIVAMENTE de [providerType].
   * Alternar responsáveis ou alunos NÃO dispara chamadas assíncronas redundantes.
   */
  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    const provider = getSchoolProvider(providerType);

    if (providerType === 'sponte') {
      setIsSponteUnavailable(true);
      setIsLoading(false);
      return;
    }

    setIsSponteUnavailable(false);
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
      setEventos(allEventos);
      setTitulos(allTitulos);
      setIndicadores(dashIndicators);

      // Definir responsável padrão sem aninhar chamadas de setState dentro de updaters
      const currentResp = activeResponsavelRef.current || allResponsaveis[0] || null;
      let linkedKids: Aluno[] = [];
      let selectedKid: Aluno | null = null;

      if (currentResp) {
        linkedKids = allAlunos.filter((a) => currentResp.alunosVinculadosIds.includes(a.id));
        const currentKid = activeAlunoRef.current;
        selectedKid = (currentKid && linkedKids.some((k) => k.id === currentKid.id))
          ? currentKid
          : (linkedKids[0] || null);

        activeResponsavelRef.current = currentResp;
        activeAlunoRef.current = selectedKid;

        setActiveResponsavelState(currentResp);
        setAlunosVinculados(linkedKids);
        setActiveAlunoState(selectedKid);
        setComunicados(
          allComunicados.map((c) => ({
            ...c,
            lidoPeloUsuario: (c.lidosPorResponsaveisIds || []).includes(currentResp.id),
          }))
        );
      } else {
        setComunicados(allComunicados);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do provedor:', err);
    } finally {
      setIsLoading(false);
    }
  }, [providerType]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /**
   * Alternância imediata de responsável sem recarregamento de rede.
   * Reavalia em memória a lista de filhos vinculados e a situação individual de leitura.
   */
  const setActiveResponsavel = (resp: Responsavel) => {
    activeResponsavelRef.current = resp;
    setActiveResponsavelState(resp);

    const kids = alunos.filter((a) => resp.alunosVinculadosIds.includes(a.id));
    const firstKid = kids[0] || null;
    activeAlunoRef.current = firstKid;

    setAlunosVinculados(kids);
    setActiveAlunoState(firstKid);

    // Atualiza individualmente a situação de leitura dos comunicados para o novo responsável
    setComunicados((prev) =>
      prev.map((c) => ({
        ...c,
        lidoPeloUsuario: (c.lidosPorResponsaveisIds || []).includes(resp.id),
      }))
    );
  };

  const setActiveAluno = (aluno: Aluno) => {
    activeAlunoRef.current = aluno;
    setActiveAlunoState(aluno);
  };

  const switchProvider = (type: ProviderType) => {
    setSchoolProviderType(type);
    setProviderTypeState(type);
  };

  const publicarComunicado = async (dto: CreateComunicadoDTO): Promise<Comunicado> => {
    const provider = getSchoolProvider(providerType);
    const novo = await provider.criarComunicado(dto);
    const updated = await provider.getComunicados();

    const currentRespId = activeResponsavel?.id;
    setComunicados(
      updated.map((c) => ({
        ...c,
        lidoPeloUsuario: currentRespId ? (c.lidosPorResponsaveisIds || []).includes(currentRespId) : false,
      }))
    );

    const updatedInd = await provider.getDashboardIndicators();
    setIndicadores(updatedInd);
    return novo;
  };

  /**
   * Marca o comunicado como lido exclusivamente para o responsável ativo.
   */
  const marcarComoLido = async (comunicadoId: string): Promise<void> => {
    if (!activeResponsavel) return;
    const respId = activeResponsavel.id;
    const provider = getSchoolProvider(providerType);
    await provider.marcarComunicadoLido(comunicadoId, respId);

    setComunicados((prev) =>
      prev.map((c) => {
        if (c.id === comunicadoId) {
          const currentLidos = c.lidosPorResponsaveisIds || [];
          const jaLido = currentLidos.includes(respId);
          const updatedLidos = jaLido ? currentLidos : [...currentLidos, respId];
          return {
            ...c,
            lidosPorResponsaveisIds: updatedLidos,
            lidoPeloUsuario: true,
            leiturasConfirmadas: jaLido ? c.leiturasConfirmadas : c.leiturasConfirmadas + 1,
          };
        }
        return c;
      })
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
        isSponteUnavailable,
        publicarComunicado,
        marcarComoLido,
        recarregarDados: carregarDados,
        showSponteDocs,
        setShowSponteDocs,
        showStorytelling,
        setShowStorytelling,
        showAcceptanceCriteria,
        setShowAcceptanceCriteria,
        isMobileDevicePreview,
        setIsMobileDevicePreview,
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
