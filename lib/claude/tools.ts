import Anthropic from "@anthropic-ai/sdk";

// Tool definitions pour forcer Claude à produire un JSON structuré
export const extractContractTool: Anthropic.Tool = {
  name: "extract_contract_data",
  description: "Extrait les données structurées d'un contrat B2B",
  input_schema: {
    type: "object",
    properties: {
      supplier_name: { type: "string" },
      contract_type: { type: "string" },
      start_date: { type: "string", description: "YYYY-MM-DD" },
      end_date: { type: "string", description: "YYYY-MM-DD" },
      duration_months: { type: "number" },
      notice_period_days: { type: "number" },
      monthly_price_eur: { type: "number" },
      indexation_clause: { type: "string" },
      indexation_rate_pct: { type: "number" },
      tacit_renewal: { type: "boolean" },
      tacit_renewal_months: { type: "number" },
      termination_fees_eur: { type: "number" },
      restitution_fees: { type: "string" },
      dangerous_clauses: {
        type: "array",
        items: {
          type: "object",
          properties: {
            clause: { type: "string" },
            severity: { type: "string", enum: ["info", "warning", "critical"] },
            explanation: { type: "string" },
          },
          required: ["clause", "severity", "explanation"],
        },
      },
      included_services: { type: "array", items: { type: "string" } },
    },
    required: ["dangerous_clauses", "included_services"],
  },
};

export const extractProposalTool: Anthropic.Tool = {
  name: "extract_proposal_data",
  description: "Extrait les données d'un devis / proposition commerciale",
  input_schema: {
    type: "object",
    properties: {
      supplier_name: { type: "string" },
      promised_monthly_price_eur: { type: "number" },
      promised_services: { type: "array", items: { type: "string" } },
      promised_duration_months: { type: "number" },
      commercial_conditions: { type: "array", items: { type: "string" } },
      special_offers: { type: "array", items: { type: "string" } },
    },
    required: ["promised_services", "commercial_conditions", "special_offers"],
  },
};

export const extractInvoiceTool: Anthropic.Tool = {
  name: "extract_invoice_data",
  description: "Extrait les données d'une facture",
  input_schema: {
    type: "object",
    properties: {
      supplier_name: { type: "string" },
      invoice_date: { type: "string", description: "YYYY-MM-DD" },
      period: { type: "string" },
      total_eur: { type: "number" },
      line_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            amount_eur: { type: "number" },
            is_expected: { type: "boolean" },
          },
          required: ["label", "amount_eur"],
        },
      },
      extra_fees_eur: { type: "number" },
    },
    required: ["line_items"],
  },
};

export const classifyDocumentTool: Anthropic.Tool = {
  name: "classify_document",
  description: "Classe un document B2B en contrat / devis / facture",
  input_schema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["contract", "proposal", "invoice", "unknown"],
      },
      confidence: { type: "number", minimum: 0, maximum: 1 },
    },
    required: ["type", "confidence"],
  },
};

export const generateAuditTool: Anthropic.Tool = {
  name: "generate_audit_report",
  description:
    "Génère un rapport d'audit basé sur la corrélation contrat / devis / facture. Produire findings actionnables avec chiffres.",
  input_schema: {
    type: "object",
    properties: {
      confidence_score: { type: "number", minimum: 0, maximum: 100 },
      total_savings_eur: { type: "number" },
      summary: {
        type: "string",
        description: "Résumé en 2-3 phrases, ton direct et incisif",
      },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            severity: {
              type: "string",
              enum: ["info", "warning", "critical"],
            },
            category: {
              type: "string",
              description:
                "ex: 'Écart tarifaire', 'Clause piège', 'Service non rendu', 'Frais caché', 'Indexation'",
            },
            title: { type: "string" },
            promised_value: { type: "string" },
            actual_value: { type: "string" },
            recommendation: {
              type: "string",
              description: "Action concrète de renégociation",
            },
            confidence: { type: "number", minimum: 0, maximum: 100 },
            savings_eur: {
              type: "number",
              description: "Économie annuelle estimée",
            },
          },
          required: [
            "severity",
            "category",
            "title",
            "recommendation",
            "confidence",
          ],
        },
      },
    },
    required: ["confidence_score", "total_savings_eur", "summary", "findings"],
  },
};
