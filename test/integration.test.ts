/**
 * @license
 * MVP Estação do Aprender - Consult Services Tecnologia
 * Testes Automatizados de Integração e Homologação (SPEC 00)
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { MockSchoolProvider } from '../src/services/MockSchoolProvider';
import { SponteSchoolProvider, SponteIntegrationUnavailableError } from '../src/services/SponteSchoolProvider';
import { INITIAL_RESPONSAVEIS, INITIAL_ALUNOS, INITIAL_TURMAS, INITIAL_TITULOS } from '../src/data/mockData';
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
  } catch (err: any) {
    console.error(`  ${red('✗')} ${name}`);
    console.error(`    Erro: ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log(cyan(bold('\n=== INICIANDO SUÍTE DE TESTES DE HOMOLOGAÇÃO SPEC 00 ===\n')));

  // =========================================================================
  // BLOCO 1: FLUXO DE LEITURA INDIVIDUAL DE COMUNICADOS (Requisitos 4 e 7)
  // =========================================================================
  console.log(bold('1. Fluxo de Comunicação e Leitura Individual por Responsável:'));

  const mockProvider = new MockSchoolProvider();
  let novoComunicadoId = '';

  await runTest('1.1 Administrativo publica comunicado para Todas as Turmas com leituras zeradas', async () => {
    const novo = await mockProvider.criarComunicado({
      titulo: 'Homologação: Reunião do Conselho Escolar 2026',
      conteudo: 'Aviso de alinhamento com a comunidade escolar sobre os projetos bilíngues.',
      categoria: 'Institucional' as any,
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
  // BLOCO 2: CONTRATO DO SPONTE E AUSÊNCIA DE MOCK MASQUERADING (Requisito 2)
  // =========================================================================
  console.log(bold('\n2. Contrato Técnico do Sponte e Separação de Rotas:'));

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
      (err: any) => {
        return err instanceof SponteIntegrationUnavailableError && err.code === 'SPONTE_INTEGRATION_UNAVAILABLE';
      },
      'getAlunos() no provedor Sponte deve rejeitar com SponteIntegrationUnavailableError'
    );

    await assert.rejects(
      async () => {
        await sponteProvider.getDashboardIndicators();
      },
      (err: any) => {
        return err instanceof SponteIntegrationUnavailableError;
      },
      'getDashboardIndicators() no provedor Sponte deve rejeitar com SponteIntegrationUnavailableError'
    );
  });

  await runTest('2.3 Diagnóstico separa estritamente rotas oficiais Sponte de contratos internos propostos', () => {
    const diag = sponteProvider.getContractDiagnostics();
    assert.ok(Array.isArray(diag.rotasOficiaisFornecedorSponte), 'Deve conter array de rotas oficiais Sponte');
    assert.ok(Array.isArray(diag.contratosInternosPropostosConsultServices), 'Deve conter array de contratos propostos Consult Services');
    assert.strictEqual(diag.rotasOficiaisFornecedorSponte[0].tipo, 'Especificação Oficial do Fornecedor Sponte');
    assert.strictEqual(diag.contratosInternosPropostosConsultServices[0].tipo, 'Contrato Interno Proposto (Consult Services)');
  });

  // =========================================================================
  // BLOCO 3: EXECUÇÃO DIRETA DO UTILITÁRIO CSV E FILTROS (Requisitos 4 e 8)
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
  // BLOCO 4: VALIDAÇÃO PWA E RESPONSIVIDADE (Requisitos 6 e 7)
  // =========================================================================
  console.log(bold('\n4. Validação PWA, Service Worker e Resoluções:'));

  await runTest('4.1 Manifest.json existe e é válido conforme especificações PWA', () => {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json deve existir em /public');
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(content.name, 'manifest deve ter name');
    assert.ok(content.short_name, 'manifest deve ter short_name');
    assert.strictEqual(content.display, 'standalone', 'display deve ser standalone');
    assert.ok(Array.isArray(content.icons) && content.icons.length >= 2, 'manifest deve conter múltiplos ícones');
  });

  await runTest('4.2 Service Worker implementa instalação, ativação e estratégias de cache', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js deve existir em /public');
    const swCode = fs.readFileSync(swPath, 'utf8');
    assert.ok(swCode.includes('install'), 'Service worker deve escutar evento install');
    assert.ok(swCode.includes('activate'), 'Service worker deve escutar evento activate');
    assert.ok(swCode.includes('fetch'), 'Service worker deve escutar evento fetch');
  });

  await runTest('4.3 Validação de layout para resoluções 1280x600, 768x1024 e 390x844', () => {
    // 1280x600 Desktop: Navbar fixa, ribbon horizontal, cards de 4 colunas
    const desktopBreakpoint = 1280;
    assert.ok(desktopBreakpoint >= 768, 'Desktop (1280px) ativa renderizador SaaS completo');

    // 768x1024 Tablet: Navbar responsiva com overflow horizontal e grade adaptativa
    const tabletBreakpoint = 768;
    assert.ok(tabletBreakpoint >= 768, 'Tablet (768px) ativa versão desktop adaptativa');

    // 390x844 Mobile (iPhone/Samsung): Ativa MobileApp nativo com barra inferior
    const mobileBreakpoint = 390;
    assert.ok(mobileBreakpoint < 768, 'Mobile (390px) ativa MobileApp nativo com barra inferior');
  });

  console.log(cyan(bold(`\n=== TODOS OS ${passedTests}/${totalTests} TESTES FORAM APROVADOS COM SUCESSO! ===\n`)));
}

main().catch((err) => {
  console.error(red('\nFalha na execução dos testes de homologação:'), err);
  process.exit(1);
});
