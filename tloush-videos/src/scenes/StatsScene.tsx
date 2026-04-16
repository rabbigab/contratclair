import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 30, suffix: "s", label: "pour comprendre", delay: 10 },
    { value: 500, suffix: "+", label: "documents analyses", delay: 30 },
    { value: 12, suffix: "+", label: "types de documents", delay: 50 },
  ];

  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)",
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
            color: "white",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 70,
          }}
        >
          Des chiffres qui parlent
        </h2>
      </FadeInText>

      <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        {stats.map((stat) => {
          const s = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 15, stiffness: 150 },
          });
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const scale = interpolate(s, [0, 1], [0.5, 1]);

          return (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  color: "#60A5FA",
                  fontSize: 80,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter
                  to={stat.value}
                  delay={stat.delay}
                  suffix={stat.suffix}
                />
              </div>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: 24,
                  fontWeight: 500,
                  marginTop: 12,
                }}
              >
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Supported docs strip */}
      <FadeInText delay={80} direction="up">
        <div
          style={{
            marginTop: 70,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            "Fiche de paie",
            "Bituah Leumi",
            "Impots",
            "Contrat",
            "Retraite",
            "Factures",
          ].map((doc) => (
            <div
              key={doc}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 999,
                padding: "8px 20px",
                color: "#CBD5E1",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {doc}
            </div>
          ))}
        </div>
      </FadeInText>
    </div>
  );
};
