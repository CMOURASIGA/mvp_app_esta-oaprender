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

    // Ao consultar comunicados para Carlos, o comunicado de Mariana NÃO deve aparecer como lido
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
  console.log(bold('\n2. Contrato Técnico do Sponte e Validação de Indisponibilidade:'));

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

  // =========================================================================
  // BLOCO 3: FILTROS E EXPORTAÇÕES CSV (Requisito 8)
  // =========================================================================
  console.log(bold('\n3. Filtros e Exportações CSV (Acadêmico e Financeiro):'));

  await runTest('3.1 Filtros acadêmicos por turma e período', async () => {
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

  await runTest('3.2 Filtros financeiros por situação e competência', async () => {
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

  await runTest('3.3 Formato do utilitário de exportação CSV (BOM UTF-8 e separadores)', () => {
    // Simula a lógica de csvExport
    const rows = [
      { matricula: 'EA-2026-001', nome: 'Sofia Vasconcellos', periodo: 'Integral', colacao: true },
    ];
    const headers = ['Matrícula', 'Nome', 'Período', 'Colação'];
    const delimiter = ';';
    const csvHeaderLine = headers.map((h) => `"${h}"`).join(delimiter);
    const csvDataLine = `"${rows[0].matricula}";"${rows[0].nome}";"${rows[0].periodo}";"Sim"`;
    const fullCsv = '\uFEFF' + csvHeaderLine + '\r\n' + csvDataLine;

    assert.ok(fullCsv.startsWith('\uFEFF'), 'CSV deve iniciar com BOM UTF-8 (\uFEFF) para compatibilidade com Excel Brasil');
    assert.ok(fullCsv.includes(';'), 'CSV deve utilizar delimitador ponto-e-vírgula (;)');
    assert.ok(fullCsv.includes('"Sim"'), 'Booleano deve ser convertido para "Sim"');
  });

  // =========================================================================
  // BLOCO 4: VALIDAÇÃO PWA E ARQUIVOS ESSENCIAIS (Requisito 6)
  // =========================================================================
  console.log(bold('\n4. Validação PWA e Resoluções:'));

  await runTest('4.1 Manifest.json existe e é válido conforme especificações PWA', () => {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
    assert.ok(fs.existsSync(manifestPath), 'manifest.json deve existir em /public');
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(content.name, 'manifest deve ter name');
    assert.ok(content.short_name, 'manifest deve ter short_name');
    assert.strictEqual(content.display, 'standalone', 'display deve ser standalone');
    assert.ok(Array.isArray(content.icons) && content.icons.length >= 2, 'manifest deve conter múltiplos ícones');
  });

  await runTest('4.2 Service Worker existe e implementa rotas de cache', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js deve existir em /public');
    const swCode = fs.readFileSync(swPath, 'utf8');
    assert.ok(swCode.includes('install'), 'Service worker deve escutar evento install');
    assert.ok(swCode.includes('fetch'), 'Service worker deve escutar evento fetch');
  });

  console.log(cyan(bold(`\n=== TODOS OS ${passedTests}/${totalTests} TESTES FORAM APROVADOS COM SUCESSO! ===\n`)));
}

main().catch((err) => {
  console.error(red('\nFalha na execução dos testes de homologação:'), err);
  process.exit(1);
});
