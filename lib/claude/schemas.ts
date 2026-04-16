import { z } from "zod";

// ============================================================
// Schémas Zod partagés front/back
// ============================================================

export const ContractExtractSchema = z.object({
  supplier_name: z.string().nullable(),
  contract_type: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  duration_months: z.number().nullable(),
  notice_period_days: z.number().nullable(),
  monthly_price_eur: z.number().nullable(),
  indexation_clause: z.string().nullable(),
  indexation_rate_pct: z.number().nullable(),
  tacit_renewal: z.boolean().nullable(),
  tacit_renewal_months: z.number().nullable(),
  termination_fees_eur: z.number().nullable(),
  restitution_fees: z.string().nullable(),
  dangerous_clauses: z.array(
    z.object({
      clause: z.string(),
      severity: z.enum(["info", "warning", "critical"]),
      explanation: z.string(),
    })
  ),
  included_services: z.array(z.string()),
});

export const ProposalExtractSchema = z.object({
  supplier_name: z.string().nullable(),
  promised_monthly_price_eur: z.number().nullable(),
  promised_services: z.array(z.string()),
  promised_duration_months: z.number().nullable(),
  commercial_conditions: z.array(z.string()),
  special_offers: z.array(z.string()),
});

export const InvoiceExtractSchema = z.object({
  supplier_name: z.string().nullable(),
  invoice_date: z.string().nullable(),
  period: z.string().nullable(),
  total_eur: z.number().nullable(),
  line_items: z.array(
    z.object({
      label: z.string(),
      amount_eur: z.number(),
      is_expected: z.boolean().nullable(),
    })
  ),
  extra_fees_eur: z.number().nullable(),
});

export const FindingSchema = z.object({
  severity: z.enum(["info", "warning", "critical"]),
  category: z.string(),
  title: z.string(),
  promised_value: z.string().nullable(),
  actual_value: z.string().nullable(),
  recommendation: z.string(),
  confidence: z.number(),
  savings_eur: z.number().nullable(),
});

export const AuditReportSchema = z.object({
  confidence_score: z.number(),
  total_savings_eur: z.number(),
  findings: z.array(FindingSchema),
  summary: z.string(),
});

export type ContractExtract = z.infer<typeof ContractExtractSchema>;
export type ProposalExtract = z.infer<typeof ProposalExtractSchema>;
export type InvoiceExtract = z.infer<typeof InvoiceExtractSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type AuditReport = z.infer<typeof AuditReportSchema>;
