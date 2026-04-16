import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS, estimateCostEur } from "@/lib/claude/client";
import {
  AUDIT_SYSTEM,
  CLASSIFY_SYSTEM,
  EXTRACT_CONTRACT_SYSTEM,
  EXTRACT_INVOICE_SYSTEM,
  EXTRACT_PROPOSAL_SYSTEM,
} from "@/lib/claude/prompts";
import {
  classifyDocumentTool,
  extractContractTool,
  extractInvoiceTool,
  extractProposalTool,
  generateAuditTool,
} from "@/lib/claude/tools";

export type DocInput = {
  id: string;
  type: "contract" | "proposal" | "invoice" | "unknown";
  base64: string;
  mimeType: string;
};

function toolUseOutput<T = unknown>(response: Anthropic.Message): T | null {
  const block = response.content.find((c) => c.type === "tool_use");
  if (block && block.type === "tool_use") return block.input as T;
  return null;
}

function buildDocBlock(doc: DocInput) {
  if (doc.mimeType === "application/pdf") {
    return {
      type: "document" as const,
      source: {
        type: "base64" as const,
        media_type: "application/pdf" as const,
        data: doc.base64,
      },
    };
  }
  // JPG / PNG
  return {
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: doc.mimeType as "image/jpeg" | "image/png",
      data: doc.base64,
    },
  };
}

// ============================================================
// 1. Classification (Haiku, rapide & peu coûteux)
// ============================================================
export async function classifyDocument(doc: DocInput) {
  const res = await anthropic.messages.create({
    model: MODELS.HAIKU,
    max_tokens: 256,
    system: CLASSIFY_SYSTEM,
    tools: [classifyDocumentTool],
    tool_choice: { type: "tool", name: "classify_document" },
    messages: [
      {
        role: "user",
        content: [
          buildDocBlock(doc),
          { type: "text", text: "Classe ce document." },
        ],
      },
    ],
  });

  const out = toolUseOutput<{ type: DocInput["type"]; confidence: number }>(res);
  return {
    type: out?.type ?? "unknown",
    confidence: out?.confidence ?? 0,
    usage: res.usage,
  };
}

// ============================================================
// 2. Extractions par type
// ============================================================
export async function extractContract(doc: DocInput) {
  const res = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 4096,
    system: EXTRACT_CONTRACT_SYSTEM,
    tools: [extractContractTool],
    tool_choice: { type: "tool", name: "extract_contract_data" },
    messages: [
      {
        role: "user",
        content: [
          buildDocBlock(doc),
          { type: "text", text: "Extrais les données de ce contrat." },
        ],
      },
    ],
  });
  return { data: toolUseOutput(res), usage: res.usage, model: "SONNET" as const };
}

export async function extractProposal(doc: DocInput) {
  const res = await anthropic.messages.create({
    model: MODELS.HAIKU,
    max_tokens: 2048,
    system: EXTRACT_PROPOSAL_SYSTEM,
    tools: [extractProposalTool],
    tool_choice: { type: "tool", name: "extract_proposal_data" },
    messages: [
      {
        role: "user",
        content: [
          buildDocBlock(doc),
          { type: "text", text: "Extrais les données de ce devis." },
        ],
      },
    ],
  });
  return { data: toolUseOutput(res), usage: res.usage, model: "HAIKU" as const };
}

export async function extractInvoice(doc: DocInput) {
  const res = await anthropic.messages.create({
    model: MODELS.HAIKU,
    max_tokens: 2048,
    system: EXTRACT_INVOICE_SYSTEM,
    tools: [extractInvoiceTool],
    tool_choice: { type: "tool", name: "extract_invoice_data" },
    messages: [
      {
        role: "user",
        content: [
          buildDocBlock(doc),
          { type: "text", text: "Extrais les données de cette facture." },
        ],
      },
    ],
  });
  return { data: toolUseOutput(res), usage: res.usage, model: "HAIKU" as const };
}

// ============================================================
// 3. Corrélation + rapport final (Sonnet)
// ============================================================
export async function correlateAndGenerateReport(
  contractData: unknown,
  proposalData: unknown,
  invoiceData: unknown
) {
  const res = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 4096,
    system: AUDIT_SYSTEM,
    tools: [generateAuditTool],
    tool_choice: { type: "tool", name: "generate_audit_report" },
    messages: [
      {
        role: "user",
        content: `Voici les données extraites des 3 documents :

**CONTRAT** :
${JSON.stringify(contractData, null, 2)}

**DEVIS / PROPOSITION** :
${JSON.stringify(proposalData, null, 2)}

**FACTURE** :
${JSON.stringify(invoiceData, null, 2)}

Croise ces données, identifie TOUS les écarts, clauses pièges, frais cachés et dérives tarifaires. Calcule les économies potentielles annuelles. Produis un rapport actionnable.`,
      },
    ],
  });
  return { report: toolUseOutput(res), usage: res.usage, model: "SONNET" as const };
}

// ============================================================
// 4. Pipeline orchestré
// ============================================================
export async function runAuditPipeline(docs: DocInput[]) {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCost = 0;

  const trackUsage = (usage: { input_tokens: number; output_tokens: number }, model: "SONNET" | "HAIKU") => {
    totalInputTokens += usage.input_tokens;
    totalOutputTokens += usage.output_tokens;
    totalCost += estimateCostEur(model, usage.input_tokens, usage.output_tokens);
  };

  // Classification des documents non typés
  const typedDocs = await Promise.all(
    docs.map(async (doc) => {
      if (doc.type !== "unknown") return doc;
      const cls = await classifyDocument(doc);
      trackUsage(cls.usage, "HAIKU");
      return { ...doc, type: cls.type };
    })
  );

  // Extraction parallèle par type
  const contractDoc = typedDocs.find((d) => d.type === "contract");
  const proposalDoc = typedDocs.find((d) => d.type === "proposal");
  const invoiceDoc = typedDocs.find((d) => d.type === "invoice");

  const [contractResult, proposalResult, invoiceResult] = await Promise.all([
    contractDoc ? extractContract(contractDoc) : Promise.resolve(null),
    proposalDoc ? extractProposal(proposalDoc) : Promise.resolve(null),
    invoiceDoc ? extractInvoice(invoiceDoc) : Promise.resolve(null),
  ]);

  if (contractResult) trackUsage(contractResult.usage, contractResult.model);
  if (proposalResult) trackUsage(proposalResult.usage, proposalResult.model);
  if (invoiceResult) trackUsage(invoiceResult.usage, invoiceResult.model);

  // Corrélation + rapport
  const correlation = await correlateAndGenerateReport(
    contractResult?.data ?? null,
    proposalResult?.data ?? null,
    invoiceResult?.data ?? null
  );
  trackUsage(correlation.usage, correlation.model);

  return {
    contract: contractResult?.data ?? null,
    proposal: proposalResult?.data ?? null,
    invoice: invoiceResult?.data ?? null,
    report: correlation.report,
    metadata: {
      tokens_input: totalInputTokens,
      tokens_output: totalOutputTokens,
      cost_eur: Math.round(totalCost * 10000) / 10000,
    },
  };
}
