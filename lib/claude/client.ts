import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODELS = {
  SONNET: "claude-sonnet-4-6" as const,
  HAIKU: "claude-haiku-4-5-20251001" as const,
};

// Coûts approximatifs (USD → EUR ~0.92)
export const PRICING = {
  SONNET: { input: 0.003, output: 0.015 }, // per 1k tokens
  HAIKU: { input: 0.0008, output: 0.004 },
};

export function estimateCostEur(
  model: "SONNET" | "HAIKU",
  inputTokens: number,
  outputTokens: number
): number {
  const p = PRICING[model];
  const usd = (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output;
  return Math.round(usd * 0.92 * 10000) / 10000;
}
