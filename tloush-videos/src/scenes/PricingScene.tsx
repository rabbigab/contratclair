import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

const plans = [
  {
    name: "Gratuit",
    price: "0₪",
    period: "",
    features: ["3 analyses offertes", "1 membre"],
    highlight: false,
  },
  {
    name: "Solo",
    price: "49₪",
    period: "/mois",
    features: ["30 analyses/mois", "Assistant IA", "1 membre"],
    highlight: true,
  },
  {
    name: "Famille",
    price: "99₪",
    period: "/mois",
    features: ["100 analyses/mois", "Assistant IA", "Jusqu'a 5 membres"],
    highlight: false,
  },
];

export const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: 80,
      }}
    >
      <FadeInText delay={0} direction="up">
        <h2
          style={{
            color: "#0F172A",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 60,
          }}
        >
          Des tarifs simples et transparents
        </h2>
      </FadeInText>

      <div style={{ display: "flex", gap: 32, alignItems: "stretch" }}>
        {plans.map((plan, i) => {
          const cardDelay = 20 + i * 20;
          const s = spring({
            frame: frame - cardDelay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [60, 0]);

          return (
            <div
              key={plan.name}
              style={{
                width: 300,
                background: plan.highlight
                  ? "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)"
                  : "white",
                borderRadius: 24,
                padding: 40,
                opacity,
                transform: `translateY(${y}px) scale(${plan.highlight ? 1.05 : 1})`,
                boxShadow: plan.highlight
                  ? "0 12px 40px rgba(37, 99, 235, 0.3)"
                  : "0 4px 24px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  color: plan.highlight ? "rgba(255,255,255,0.8)" : "#64748B",
                  fontSize: 20,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                {plan.name}
              </h3>
              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    color: plan.highlight ? "white" : "#0F172A",
                    fontSize: 52,
                    fontWeight: 800,
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    color: plan.highlight
                      ? "rgba(255,255,255,0.7)"
                      : "#94A3B8",
                    fontSize: 20,
                  }}
                >
                  {plan.period}
                </span>
              </div>
              {plan.features.map((feat) => (
                <p
                  key={feat}
                  style={{
                    color: plan.highlight
                      ? "rgba(255,255,255,0.9)"
                      : "#475569",
                    fontSize: 20,
                    lineHeight: 1.8,
                  }}
                >
                  ✓ {feat}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
