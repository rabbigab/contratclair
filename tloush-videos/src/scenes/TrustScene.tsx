import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

const badges = [
  {
    icon: "🛡️",
    title: "Securite",
    text: "Documents chiffres, stockage prive",
  },
  {
    icon: "🧠",
    title: "IA avancee",
    text: "Claude (Anthropic), la meilleure IA pour les documents",
  },
  {
    icon: "🇮🇱",
    title: "Specialise Israel",
    text: "Droit du travail israelien integre",
  },
  {
    icon: "👨‍⚖️",
    title: "Experts",
    text: "Orientation vers le bon professionnel",
  },
];

export const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        background: "white",
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
          Pourquoi faire confiance a Tloush ?
        </h2>
      </FadeInText>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          maxWidth: 900,
        }}
      >
        {badges.map((badge, i) => {
          const badgeDelay = 20 + i * 18;
          const s = spring({
            frame: frame - badgeDelay,
            fps,
            config: { damping: 20, stiffness: 200 },
          });
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const scale = interpolate(s, [0, 1], [0.8, 1]);

          return (
            <div
              key={badge.title}
              style={{
                background: "#F8FAFC",
                borderRadius: 20,
                padding: 32,
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <span style={{ fontSize: 40 }}>{badge.icon}</span>
              <div>
                <h3
                  style={{
                    color: "#0F172A",
                    fontSize: 24,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {badge.title}
                </h3>
                <p style={{ color: "#64748B", fontSize: 19, lineHeight: 1.4 }}>
                  {badge.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
