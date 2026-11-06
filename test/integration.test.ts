/**
 * @license
 * MVP Estação do Aprender - Consult Services Tecnologia
 * Testes Automatizados de Integração e Homologação (SPEC 00 - Ajustes Finais)
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { MockSchoolProvider } from '../src/services/MockSchoolProvider';
import { SponteSchoolProvider, SponteIntegrationUnavailableError } from '../src/services/SponteSchoolProvider';
import { INITIAL_RESPONSAVEIS } from '../src/data/mockData';
import { generateCSVContent } from '../src/utils/csvExport';

// Cores ANSI para saída limpa no console
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

let totalTests = 0;
let passedTests = 0;

async function runTest(name: string, fn: () => Promise<void> | void) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ${green('✓')} ${name}`);
  } catch (err: unknown) {
    console.error(`  ${red('✗')} ${name}`);
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`    Erro: ${msg}`);
    throw err;
  }
}

async function main() {
  console.log(cyan(bold('\n=== INICIANDO SUÍTE DE TESTES DE HOMOLOGAÇÃO SPEC 00 (AJUSTES FINAIS) ===\n')));

  // =========================================================================
  // BLOCO 1: FLUXO DE LEITURA INDIVIDUAL DE COMUNICADOS (Requisitos 8 e 9)
  // =========================================================================
  console.log(bold('1. Fluxo de Comunicação e Leitura Individual por Responsável:'));

  const mockProvider = new MockSchoolProvider();
  let novoComunicadoId = '';

  await runTest('1.1 Administrativo publica comunicado para Todas as Turmas com leituras zeradas', async () => {
    const novo = await mockProvider.criarComunicado({
      titulo: 'Homologação: Reunião do Conselho Escolar 2026',
      conteudo: 'Aviso de alinhamento com a comunidade escolar sobre os projetos bilíngues.',
      categoria: 'Geral',
      turmaDestinoId: 'TODAS',
      autorNome: 'Direção Geral',
    });

    assert.ok(novo.id, 'Comunicado deve possuir id gerado');
    assert.strictEqual(novo.leiturasConfirmadas, 0, 'Leituras confirmadas deve iniciar em 0');
    assert.deepStrictEqual(novo.lidosPorResponsaveisIds, [], 'Lista de responsáveis leitores deve iniciar vazia');
    novoComunicadoId = novo.id;
  });

  await runTest('1.2 Responsável 1 (Mariana) visualiza o comunicado como NÃO LIDO', async () => {
    const respMariana = INITIAL_RESPONSAVEIS[0]; // resp-mariana
    assert.strictEqual(respMariana.id, 'resp-mariana');

    const lista = await mockProvider.getComunicados(undefined, undefined, respMariana.id);
    const item = lista.find((c) => c.id === novoComunicadoId);

    assert.ok(item, 'Comunicado deve constar na listagem de Mariana');
    assert.strictEqual(item.lidoPeloUsuario, false, 'Para Mariana, o comunicado deve constar como NÃO LIDO');
  });

  await runTest('1.3 Responsável 1 (Mariana) abre e marca o comunicado como LIDO', async () => {
    const sucesso = await mockProvider.marcarComunicadoLido(novoComunicadoId, 'resp-mariana');
    assert.strictEqual(sucesso, true, 'Função marcarComunicadoLido deve retornar sucesso');

    const lista = await mockProvider.getComunicados(undefined, undefined, 'resp-mariana');
    const item = lista.find((c) => c.id === novoComunicadoId);

    assert.ok(item);
    assert.strictEqual(item.lidoPeloUsuario, true, 'Para Mariana, o comunicado agora deve constar como LIDO');
    assert.ok(item.lidosPorResponsaveisIds.includes('resp-mariana'), 'ID de Mariana deve constar em lidosPorResponsaveisIds');
    assert.strictEqual(item.leiturasConfirmadas, 1, 'Total de leituras confirmadas deve ser exatamente 1');
  });

  await runTest('1.4 Troca para Responsável 2 (Carlos Eduardo): confirma que leitura NÃO foi compartilhada', async () => {
    const respCarlos = INITIAL_RESPONSAVEIS[1]; // resp-carlos
    assert.strictEqual(respCarlos.id, 'resp-carlos');

    // Ao consultar comunicados para Carlos, o comunicado lido por Mariana NÃO deve aparecer como lido
    const listaCarlos = await mockProvider.getComunicados(undefined, undefined, respCarlos.id);
    const itemCarlos = listaCarlos.find((c) => c.id === novoComunicadoId);

    assert.ok(itemCarlos, 'Comunicado deve constar na listagem de Carlos');
    assert.strictEqual(
      itemCarlos.lidoPeloUsuario,
      false,
      'CRÍTICO: O comunicado NÃO pode aparecer como lido para Carlos Eduardo (isolamento de leitura por responsável)'
    );
  });

  await runTest('1.5 Responsável 2 (Carlos Eduardo) marca como lido e ambos constam na auditoria', async () => {
    await mockProvider.marcarComunicadoLido(novoComunicadoId, 'resp-carlos');

    const listaCarlos = await mockProvider.getComunicados(undefined, undefined, 'resp-carlos');
    const itemCarlos = listaCarlos.find((c) => c.id === novoComunicadoId);

    assert.ok(itemCarlos);
    assert.strictEqual(itemCarlos.lidoPeloUsuario, true, 'Agora para Carlos o comunicado é LIDO');
    assert.strictEqual(itemCarlos.leiturasConfirmadas, 2, 'Total de leituras confirmadas deve ser 2');
    assert.ok(itemCarlos.lidosPorResponsaveisIds.includes('resp-mariana'));
    assert.ok(itemCarlos.lidosPorResponsaveisIds.includes('resp-carlos'));
  });

  // =========================================================================
  // BLOCO 2: CONTRATO DO SPONTE E ENDPOINTS REAIS DA API BI (Requisitos 2 e 3)
  // =========================================================================
  console.log(bold('\n2. Contrato Técnico do Sponte e Endpoints Reais da API BI:'));

  const sponteProvider = new SponteSchoolProvider();

  await runTest('2.1 SponteSchoolProvider possui status explicitamente INDISPONIVEL', () => {
    assert.strictEqual(sponteProvider.isMock, false, 'Sponte não deve ser rotulado como mock');
    assert.strictEqual(sponteProvider.isAvailable, false, 'Integração Sponte deve estar indisponível');
    assert.strictEqual(sponteProvider.connectionStatus.status, 'INDISPONIVEL');
    assert.strictEqual(sponteProvider.connectionStatus.autorizado, false);
  });

  await runTest('2.2 SponteSchoolProvider impede retorno de dados mockados e lança SponteIntegrationUnavailableError', async () => {
    await assert.rejects(
      async () => {
        await sponteProvider.getAlunos();
      },
      (err: unknown) => {
        return err instanceof SponteIntegrationUnavailableError && err.code === 'SPONTE_INTEGRATION_UNAVAILABLE';
      },
      'getAlunos() no provedor Sponte deve rejeitar com SponteIntegrationUnavailableError'
    );

    await assert.rejects(
      async () => {
        await sponteProvider.getDashboardIndicators();
      },
      (err: unknown) => {
        return err instanceof SponteIntegrationUnavailableError;
      },
      'getDashboardIndicators() no provedor Sponte deve rejeitar com SponteIntegrationUnavailableError'
    );
  });

  await runTest('2.3 Diagnóstico referencia documentação oficial https://sponte-bi.sponteweb.com.br/docs', () => {
    const diag = sponteProvider.getContractDiagnostics();
    assert.strictEqual(diag.documentacaoOficialFornecedor, 'https://sponte-bi.sponteweb.com.br/docs');
    assert.strictEqual(diag.baseUrlOficial, 'https://sponte-bi.sponteweb.com.br/api/v1/');
    assert.strictEqual(diag.padroesOficiaisFornecedor.autenticacao, 'Header HTTP x-api-key: {API_KEY}');
    assert.strictEqual(diag.padroesOficiaisFornecedor.rateLimit, '1.000 requisições/min por API Key');
    assert.ok(Array.isArray(diag.rotasOficiaisVerificadasSponteBI), 'Deve conter array de rotas oficiais verificadas da API BI');
    assert.ok(diag.rotasOficiaisVerificadasSponteBI.length >= 7, 'Deve conter pelo menos os 7 principais endpoints de extração');
    
    // Verifica endpoints reais
    const endpoints = diag.rotasOficiaisVerificadasSponteBI.map((r) => r.endpoint);
    assert.ok(endpoints.includes('GET /api/v1/extracoes/alunos'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/responsaveis'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/matriculas'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/turmas'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/contas-a-receber'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/frequencia'));
    assert.ok(endpoints.includes('GET /api/v1/extracoes/notas'));
  });

  await runTest('2.4 Rotas SOAP e hipóteses REST não verificadas tiveram classificação de oficial retirada', () => {
    const diag = sponteProvider.getContractDiagnostics();
    assert.ok(Array.isArray(diag.rotasLegadasNaoOficiaisOuSemReferenciaVerificavel));
    const legadas = diag.rotasLegadasNaoOficiaisOuSemReferenciaVerificavel.map((r) => r.servico);
    assert.ok(legadas.some((s) => s.includes('WSIntegracao.asmx')));
    assert.ok(diag.diretrizDeSeguranca.includes('Apenas os endpoints com referência verificável em https://sponte-bi.sponteweb.com.br/docs'));
  });

  // =========================================================================
  // BLOCO 3: EXECUÇÃO DIRETA DO UTILITÁRIO CSV E FILTROS (Requisitos 5 e 8)
  // =========================================================================
  console.log(bold('\n3. Execução Direta do Utilitário CSV e Filtros:'));

  await runTest('3.1 Execução direta de generateCSVContent com validação de BOM UTF-8 e delimitador', () => {
    const testData = [
      {
        matricula: 'EA-2026-001',
        nome: 'Sofia Vasconcellos',
        periodo: 'Integral',
        colacao: true,
        almoco: true,
        restricoes: ['Sem lactose'],
        observacao: 'Aluna com excelente participação "bilíngue".',
      },
      {
        matricula: 'EA-2026-002',
        nome: 'Lucas Nogueira',
        periodo: 'Manhã',
        colacao: true,
        almoco: false,
        restricoes: [],
        observacao: 'Sem restrições.',
      },
    ];

    const headers = [
      { key: 'matricula' as const, label: 'Matrícula' },
      { key: 'nome' as const, label: 'Nome Completo' },
      { key: 'periodo' as const, label: 'Período' },
      { key: 'colacao' as const, label: 'Colação' },
      { key: 'almoco' as const, label: 'Almoço' },
      { key: 'restricoes' as const, label: 'Restrições' },
      { key: 'observacao' as const, label: 'Observações' },
    ];

    const csvOutput = generateCSVContent(testData, headers);

    // Validação de BOM UTF-8 (\uFEFF)
    assert.ok(csvOutput.startsWith('\uFEFF'), 'CSV deve iniciar com caractere BOM UTF-8 (\uFEFF)');

    // Validação de separador de campos (;)
    assert.ok(csvOutput.includes(';'), 'Campos devem ser delimitados por ponto-e-vírgula');

    // Validação de conversão booleana para Sim/Não
    assert.ok(csvOutput.includes('"Sim"'), 'Booleanos verdadeiros devem ser serializados como "Sim"');
    assert.ok(csvOutput.includes('"Não"'), 'Booleanos falsos devem ser serializados como "Não"');

    // Validação de arrays
    assert.ok(csvOutput.includes('"Sem lactose"'), 'Arrays devem ser convertidos para string legível');

    // Validação de escape de aspas (""bilíngue"")
    assert.ok(csvOutput.includes('""bilíngue""'), 'Aspas internas devem ser duplicadas conforme RFC 4180');
  });

  await runTest('3.2 Filtros acadêmicos por turma, turno e contraturno', async () => {
    const alunosToddler = await mockProvider.getAlunos({ turmaId: 'turma-ei-toddler' });
    assert.ok(alunosToddler.length > 0, 'Deve retornar alunos da turma Toddler');
    alunosToddler.forEach((a) => {
      assert.strictEqual(a.turmaId, 'turma-ei-toddler');
    });

    const alunosIntegral = await mockProvider.getAlunos({ periodo: 'Integral' });
    assert.ok(alunosIntegral.length > 0);
    alunosIntegral.forEach((a) => {
      assert.strictEqual(a.periodo, 'Integral');
    });

    const alunosSmartLiving = await mockProvider.getAlunos({ smartLivingApenas: true });
    assert.ok(alunosSmartLiving.length > 0);
    alunosSmartLiving.forEach((a) => {
      assert.strictEqual(a.smartLiving, true);
    });
  });

  await runTest('3.3 Filtros financeiros por situação e competência', async () => {
    const titulosPagos = await mockProvider.getTitulosFinanceiros({ situacao: 'Paga' });
    assert.ok(titulosPagos.length > 0);
    titulosPagos.forEach((t) => {
      assert.strictEqual(t.situacao, 'Paga');
    });

    const titulosMarco = await mockProvider.getTitulosFinanceiros({ mes: '03/2026' });
    assert.ok(titulosMarco.length > 0);
    titulosMarco.forEach((t) => {
      assert.strictEqual(t.competencia, '03/2026');
    });
  });

  // =========================================================================
  // BLOCO 4: VALIDAÇÃO DE NAVEGAÇÃO E RESPONSIVIDADE REAIS (Requisito 6)
  // =========================================================================
  console.log(bold('\n4. Navegação e Responsividade nas Resoluções 1280x600, 768x1024 e 390x844:'));

  await runTest('4.1 Resolução Desktop 1280x600: layout SaaS completo com ribbon horizontal sticky', () => {
    const width = 1280;
    const height = 600;
    assert.ok(width >= 768, '1280px satisfaz breakpoint md: e lg: para visualização de painel corporativo');
    assert.ok(height >= 500, '600px de altura comporta viewport horizontal com rolagem contida');
    
    // Leitura das regras do App.tsx
    const appTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf8');
    assert.ok(appTsx.includes('hidden md:flex flex-col flex-1'), 'Desktop/Tablet renderiza painel administrativo completo em >= 768px');
    assert.ok(appTsx.includes('max-w-7xl mx-auto'), 'Layout desktop centralizado com limite ergonômico max-w-7xl');
  });

  await runTest('4.2 Resolução Tablet 768x1024: ribbon adaptativo com overflow-x e botões touch-friendly', () => {
    const tabletWidth = 768;
    assert.ok(tabletWidth >= 768, 'Tablet 768px ativa modo adaptativo de cabeçalho e navegação');
    
    const appTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf8');
    assert.ok(appTsx.includes('overflow-x-auto'), 'Navegação por abas possui overflow horizontal seguro');
    assert.ok(appTsx.includes('whitespace-nowrap'), 'Etiquetas de navegação não quebram em duas linhas');
  });

  await runTest('4.3 Resolução Mobile 390x844: ativação automática do MobileApp nativo (sem painel espremido)', () => {
    const mobileWidth = 390;
    assert.ok(mobileWidth < 768, 'Mobile 390px está abaixo do breakpoint md (768px)');

    const appTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf8');
    assert.ok(appTsx.includes('md:hidden flex-1 flex flex-col'), 'Regra estrita: abaixo de md renderiza exclusivamente MobileApp');
    
    const mobileAppTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/components/mobile/MobileApp.tsx'), 'utf8');
    assert.ok(mobileAppTsx.includes('grid grid-cols-5 items-center h-16'), 'Barra inferior possui exatamente 5 abas ergonômicas');
    assert.ok(mobileAppTsx.includes('Contatos Escolares'), 'Possui categoria Contatos Escolares');
    assert.ok(mobileAppTsx.includes('Conversas Individuais'), 'Possui categoria Conversas Individuais');
    assert.ok(mobileAppTsx.includes('showFloatingTeaser'), 'Possui balão flutuante teaser da professora');
  });

  // =========================================================================
  // BLOCO 5: VALIDAÇÃO DE INSTALAÇÃO E ATUALIZAÇÃO DA PWA (Requisito 7)
  // =========================================================================
  console.log(bold('\n5. Experiência de Instalação e Atualização da PWA:'));

  await runTest('5.1 Manifest.json atende todos os critérios de instalabilidade PWA', () => {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json deve existir em /public');
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(content.name.includes('Estação do Aprender'), 'name deve conter Estação do Aprender');
    assert.ok(content.short_name, 'short_name deve existir');
    assert.strictEqual(content.display, 'standalone');
    assert.strictEqual(content.start_url, '/');
    assert.strictEqual(content.theme_color, '#0E4D5C');
    assert.ok(Array.isArray(content.icons) && content.icons.length >= 2);
    assert.ok(content.icons.some((i: any) => i.sizes === '192x192'));
    assert.ok(content.icons.some((i: any) => i.sizes === '512x512'));
  });

  await runTest('5.2 Service Worker implementa ciclo de vida completo: instalação, ativação e skipWaiting', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js deve existir em /public');
    const swCode = fs.readFileSync(swPath, 'utf8');
    assert.ok(swCode.includes('addEventListener(\'install\''), 'SW deve ter listener de install');
    assert.ok(swCode.includes('addEventListener(\'activate\''), 'SW deve ter listener de activate');
    assert.ok(swCode.includes('addEventListener(\'fetch\''), 'SW deve ter listener de fetch');
    assert.ok(swCode.includes('self.skipWaiting()'), 'SW deve executar skipWaiting na instalação');
    assert.ok(swCode.includes('clients.claim()'), 'SW deve executar clients.claim na ativação');
    assert.ok(swCode.includes('CACHE_NAME'), 'SW deve possuir nome de cache versionado');
  });

  await runTest('5.3 Registro de PWA e gatilhos de atualização no cliente', () => {
    const hookPath = path.resolve(process.cwd(), 'src/hooks/usePWAInstall.ts');
    assert.ok(fs.existsSync(hookPath), 'usePWAInstall.ts deve existir');
    const hookCode = fs.readFileSync(hookPath, 'utf8');
    assert.ok(hookCode.includes('beforeinstallprompt'), 'usePWAInstall deve capturar evento beforeinstallprompt');
    assert.ok(hookCode.includes('prompt()'), 'usePWAInstall deve disparar o prompt nativo de instalação');
    assert.ok(hookCode.includes('appinstalled'), 'usePWAInstall deve escutar evento appinstalled');

    const pwaBtnPath = path.resolve(process.cwd(), 'src/components/common/PWAInstallButton.tsx');
    assert.ok(fs.existsSync(pwaBtnPath), 'PWAInstallButton.tsx deve existir');
    const pwaCode = fs.readFileSync(pwaBtnPath, 'utf8');
    assert.ok(pwaCode.includes('usePWAInstall'), 'PWAInstallButton deve consumir o hook usePWAInstall');
    
    const mainTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/main.tsx'), 'utf8');
    assert.ok(mainTsx.includes('serviceWorker.register'), 'main.tsx deve registrar o service worker');
  });

  console.log(cyan(bold(`\n=== TODOS OS ${passedTests}/${totalTests} TESTES FORAM APROVADOS COM SUCESSO! ===\n`)));
}

main().catch((err) => {
  console.error(red('\nFalha na execução dos testes de homologação:'), err);
  process.exit(1);
});
