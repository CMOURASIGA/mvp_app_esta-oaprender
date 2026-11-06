import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  FileCode,
  X,
  ShieldCheck,
  Database,
  Lock,
  Layers,
  CheckCircle,
  AlertTriangle,
  Server,
  Zap,
} from 'lucide-react';

export const SponteIntegrationModal: React.FC = () => {
  const { showSponteDocs, setShowSponteDocs, providerType, switchProvider } = useSchool();

  if (!showSponteDocs) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-900 text-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono uppercase">
                SPEC 00 · Seção 8
              </span>
              <span className="text-xs text-slate-400">Consult Services Tecnologia</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-teal-400" />
              Documento Técnico: Arquitetura & Viabilidade de Integração Sponte
            </h2>
            <p className="text-xs text-slate-300">
              Mapeamento de entidades, endpoints, segurança e plano de transição para o Colégio Estação do Aprender.
            </p>
          </div>

          <button
            onClick={() => setShowSponteDocs(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-700 leading-relaxed">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-teal-950 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Contrato de Provedor Isolado (Layered Architecture)
              </div>
              <p className="text-teal-800">
                O MVP implementa a interface <code>SchoolProvider</code> com <code>MockSchoolProvider</code> e <code>SponteSchoolProvider</code>.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-500 font-medium">Provedor:</span>
              <button
                onClick={() => switchProvider(providerType === 'mock' ? 'sponte' : 'mock')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  providerType === 'mock'
                    ? 'bg-teal-800 text-white hover:bg-teal-900'
                    : 'bg-amber-800 text-amber-100 hover:bg-amber-900'
                }`}
              >
                {providerType === 'mock'
                  ? 'MockSchoolProvider (Dados Demonstrativos)'
                  : 'SponteSchoolProvider (Indisponível - SPEC §8)'}
              </button>
            </div>
          </div>

          {/* Seção 1: Dados Necessários por Módulo */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-800" />
              1. Dados Necessários por Módulo & Entidades Esperadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-800">Módulo Acadêmico & Gestão de Horários</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Aluno:</strong> ID, Matrícula, Nome, TurmaID, Período, Horário Entrada, Horário Saída.</li>
                  <li><strong>Serviços Contratados:</strong> Flag Colação, Flag Almoço, Adesão ao Smart Living.</li>
                  <li><strong>Turma:</strong> ID, Nome, Segmento, Capacidade, Docentes Regentes, Sala.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-800">Módulo Financeiro & Portal dos Pais</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Títulos:</strong> ID Título, AlunoID, Competência, Vencimento, Valor Nominal, Desconto, Status.</li>
                  <li><strong>Cobrança:</strong> Código de barras, Linha digitável, Histórico de liquidação.</li>
                  <li><strong>Responsáveis:</strong> CPF/ID, Nome, Telefone, E-mail, Vínculos parentais.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seção 2: Especificação de Rotas - Oficiais vs Propostas */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-800" />
              2. Mapeamento de Rotas: Oficial Fornecedor Sponte vs. Contratos Internos Propostos
            </h3>

            {/* 2A: Rotas Oficiais */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-teal-950">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  2A. Serviços Oficialmente Documentados pelo Fornecedor Sponte
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Sujeito à liberação de credenciais contratuais da escola
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-2.5">Serviço Oficial Sponte</th>
                      <th className="p-2.5">Protocolo / Método</th>
                      <th className="p-2.5">Finalidade Oficial</th>
                      <th className="p-2.5">Status de Disponibilidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-mono text-teal-900 font-bold">WSIntegracao.asmx (GetAlunos)</td>
                      <td className="p-2.5 font-mono">SOAP / XML</td>
                      <td className="p-2.5">Carga cadastral de alunos, matrícula e status de vínculo.</td>
                      <td className="p-2.5 text-amber-700 font-semibold">Aguardando chave oficial</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-teal-900 font-bold">WSIntegracao.asmx (GetTurmas)</td>
                      <td className="p-2.5 font-mono">SOAP / XML</td>
                      <td className="p-2.5">Relação de turmas, docentes e capacidade do período.</td>
                      <td className="p-2.5 text-amber-700 font-semibold">Aguardando chave oficial</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-teal-900 font-bold">WSIntegracao.asmx (GetFinanceiro)</td>
                      <td className="p-2.5 font-mono">SOAP / XML</td>
                      <td className="p-2.5">Extrato de parcelas escolares, status e baixas.</td>
                      <td className="p-2.5 text-amber-700 font-semibold">Aguardando chave oficial</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-teal-900 font-bold">Sponte BI Export (/api/bi/*)</td>
                      <td className="p-2.5 font-mono">REST / JSON</td>
                      <td className="p-2.5">Extração analítica e relatórios consolidados para BI.</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Condicionado a módulo BI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2B: Contratos Internos Propostos */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  2B. Contratos Internos Propostos pela Consult Services (BFF / Gateway Seguro)
                </span>
                <span className="text-[10px] text-teal-800 font-medium">
                  Arquitetura proposta para proteger chaves e unificar regras
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-2.5">Rota Interna Proposta</th>
                      <th className="p-2.5">Método</th>
                      <th className="p-2.5">Papel no Gateway BFF</th>
                      <th className="p-2.5">Origem da Definição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-mono text-slate-800 font-semibold">/api/v1/auth/token</td>
                      <td className="p-2.5 font-mono">POST</td>
                      <td className="p-2.5">Autentica servidor-a-servidor com Sponte sem expor token no cliente.</td>
                      <td className="p-2.5 text-teal-800 font-medium">Contrato Interno Consult Services</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-800 font-semibold">/api/v1/alunos</td>
                      <td className="p-2.5 font-mono">GET</td>
                      <td className="p-2.5">Normaliza dados SOAP e enriquece com horários e colação/almoço.</td>
                      <td className="p-2.5 text-teal-800 font-medium">Contrato Interno Consult Services</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-800 font-semibold">/api/v1/financeiro/titulos</td>
                      <td className="p-2.5 font-mono">GET</td>
                      <td className="p-2.5">Agrega títulos e linhas digitáveis para visualização no Portal dos Pais.</td>
                      <td className="p-2.5 text-teal-800 font-medium">Contrato Interno Consult Services</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-800 font-semibold">/api/v1/comunicacao/disparos</td>
                      <td className="p-2.5 font-mono">POST</td>
                      <td className="p-2.5">Mensageria e leitura individual (recurso não suportado nativamente na API Sponte).</td>
                      <td className="p-2.5 text-teal-800 font-medium">Contrato Interno Consult Services</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Seção 3: Lacunas & Campos Não Encontrados */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. Campos Ainda Não Nativos & Limitações da API de BI do Sponte
            </div>
            <p className="text-amber-900">
              <strong>Importante para alinhamento com a Jully:</strong> A API padrão de Business Intelligence (BI) do Sponte é puramente analítica de leitura. Ela não oferece endpoints nativos para publicação de comunicados escolares nem para gravação de horários flexíveis de entrada/saída com contraturno.
            </p>
            <p className="text-amber-900">
              <strong>Solução da Consult Services:</strong> A Consult Services fornecerá uma camada de enriquecimento cadastral (metadados complementares) que vincula os horários contratados de colação/almoço e Smart Living ao ID do aluno do Sponte, garantindo a consolidação que a escola tanto precisa sem alterar a base oficial do ERP.
            </p>
          </div>

          {/* Seção 4: Segurança, Cache e RBAC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-teal-700" />
                Segurança & Chaves
              </div>
              <p className="text-slate-600 text-[11px]">
                Nenhuma credencial ou token Sponte ficará exposto no frontend. Todas as requisições serão intermediadas por um proxy seguro Node.js com autenticação mTLS/Bearer.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-teal-700" />
                Estratégia de Cache
              </div>
              <p className="text-slate-600 text-[11px]">
                Cache em memória / Redis com TTL de 15 minutos para tabelas acadêmicas e invalidação pontual sob webhook para reduzir requisições à infraestrutura do Sponte.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                Isolamento RBAC
              </div>
              <p className="text-slate-600 text-[11px]">
                Cada responsável só tem acesso aos alunos vinculados ao seu CPF. Direção, secretaria e financeiro possuem escopos segregados por perfil de acesso.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-slate-500 text-xs">
            Documentação validada pela equipe de engenharia da Consult Services.
          </span>
          <button
            onClick={() => setShowSponteDocs(false)}
            className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs cursor-pointer hover:brightness-105"
            style={{ backgroundColor: '#0E4D5C' }}
          >
            Fechar Documento
          </button>
        </div>
      </div>
    </div>
  );
};
