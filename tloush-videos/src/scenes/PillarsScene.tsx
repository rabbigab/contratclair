import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

const pillars = [
  {
    icon: "🔍",
    title: "COMPRENDRE",
    color: "#2563EB",
    items: [
      "Traduction ligne par ligne",
      "Extraction des montants cles",
      "Salaire, cotisations, net detaille",
    ],
  },
  {
    icon: "⚠️",
    title: "VERIFIER",
    color: "#D97706",
    items: [
      "Detection d'anomalies",
      "Heures sup non payees",
      "Alertes sur les echeances",
    ],
  },
  {
    icon: "🎯",
    title: "AGIR",
    color: "#16A34A",
    items: [
      "Actions recommandees",
      "Orientation vers un expert",
      "Rappels automatiques",
    ],
  },
];

export const PillarsScene: React.FC = () => {
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
          Tloush fait le travail pour vous
        </h2>
      </FadeInText>

      <div style={{ display: "flex", gap: 40 }}>
        {pillars.map((pillar, i) => {
          const cardDelay = 25 + i * 25;
          const scale = spring({
            frame: frame - cardDelay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });
          const opacity = interpolate(
            frame - cardDelay,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={pillar.title}
              style={{
                width: 340,
                background: "white",
                borderRadius: 24,
                padding: 36,
                opacity,
                transform: `scale(${scale})`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                borderTop: `4px solid ${pillar.color}`,
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>
                {pillar.icon}
              </div>
              <h3
                style={{
                  color: pillar.color,
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: 2,
                  marginBottom: 20,
                }}
              >
                {pillar.title}
              </h3>
              {pillar.items.map((item, j) => {
                const itemDelay = cardDelay + 15 + j * 8;
                const itemOpacity = interpolate(
                  frame - itemDelay,
                  [0, 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <p
                    key={item}
                    style={{
                      color: "#475569",
                      fontSize: 20,
                      lineHeight: 1.6,
                      opacity: itemOpacity,
                      marginBottom: 4,
                    }}
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
