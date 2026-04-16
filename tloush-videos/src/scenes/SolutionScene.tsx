import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Logo } from "../components/Logo";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

const steps = [
  { emoji: "📤", text: "Deposez votre document" },
  { emoji: "🤖", text: "L'IA traduit et analyse" },
  { emoji: "✅", text: "Rapport clair en francais" },
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: 80,
      }}
    >
      {/* Logo + Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 20,
        }}
      >
        <Logo size={90} delay={5} />
        <FadeInText delay={10} direction="left">
          <span
            style={{
              color: "white",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            tloush
          </span>
        </FadeInText>
      </div>

      {/* Tagline */}
      <FadeInText delay={20} direction="up">
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 30,
            fontWeight: 400,
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Ne subissez plus vos papiers en Israel
        </p>
      </FadeInText>

      {/* 3 Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {steps.map((step, i) => {
          const stepDelay = 50 + i * 25;
          const slideX = spring({
            frame: frame - stepDelay,
            fps,
            config: { damping: 20, stiffness: 200 },
          });
          const x = interpolate(slideX, [0, 1], [-300, 0]);
          const opacity = interpolate(slideX, [0, 1], [0, 1]);

          return (
            <div
              key={step.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                {step.emoji}
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: 600,
                }}
              >
                {step.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 30 seconds badge */}
      <FadeInText delay={130} direction="up">
        <div
          style={{
            marginTop: 50,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "12px 32px",
          }}
        >
          <span style={{ color: "white", fontSize: 24, fontWeight: 500 }}>
            ⚡ Resultat en 30 secondes
          </span>
        </div>
      </FadeInText>
    </div>
  );
};
