import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";

const steps = [
  {
    num: "1",
    icon: "📤",
    title: "Uploadez le trio gagnant",
    desc: "Contrat + Devis d'origine + Dernière facture",
    color: "#3B82F6",
    delay: 30,
  },
  {
    num: "2",
    icon: "🤖",
    title: "L'IA analyse tout",
    desc: "Claude lit chaque PDF, croise les données, détecte les écarts",
    color: "#8B5CF6",
    delay: 70,
  },
  {
    num: "3",
    icon: "📊",
    title: "Rapport en 3 colonnes",
    desc: "Ce qu'on vous a promis · Ce que vous payez · Comment en sortir",
    color: "#10B981",
    delay: 110,
  },
];

export const TH_HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Trait de connexion entre les étapes
  const lineProgress = interpolate(frame, [100, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "60px 100px",
        opacity: bgOpacity,
        position: "relative",
      }}
    >
      {/* Titre */}
      <FadeInText delay={5} direction="up">
        <h2 style={{
          color: "#94A3B8",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
          Comment ça marche
        </h2>
      </FadeInText>

      <FadeInText delay={12} direction="up">
        <h1 style={{
          color: "white",
          fontSize: 50,
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 64,
          lineHeight: 1.1,
        }}>
          3 étapes. <span style={{ color: "#3B82F6" }}>5 minutes.</span> Résultat.
        </h1>
      </FadeInText>

      {/* Steps */}
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", position: "relative" }}>
        {steps.map((step, i) => {
          const prog = spring({ frame: frame - step.delay, fps, config: { damping: 20, stiffness: 160 } });
          const opacity = interpolate(prog, [0, 1], [0, 1]);
          const translateY = interpolate(prog, [0, 1], [60, 0]);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {/* Cercle numéro */}
              <div style={{
                width: 72, height: 72,
                borderRadius: "50%",
                background: step.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, fontWeight: 900, color: "white",
                marginBottom: 20,
                boxShadow: `0 8px 32px ${step.color}55`,
              }}>
                {step.num}
              </div>

              {/* Icône */}
              <div style={{ fontSize: 48, marginBottom: 16 }}>{step.icon}</div>

              {/* Titre step */}
              <h3 style={{
                color: "white",
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 10,
                lineHeight: 1.2,
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                color: "#64748B",
                fontSize: 20,
                lineHeight: 1.5,
              }}>
                {step.desc}
              </p>
            </div>
          );
        })}

        {/* Flèches de connexion */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 34,
              left: `${i === 0 ? 33 : 67}%`,
              transform: "translateX(-50%)",
              color: "#334155",
              fontSize: 32,
              opacity: lineProgress,
            }}
          >
            →
          </div>
        ))}
      </div>

      {/* Temps */}
      <FadeInText delay={160} direction="up" style={{ marginTop: 60 }}>
        <div style={{
          display: "flex",
          gap: 40,
        }}>
          {[
            { val: "5 min", label: "d'analyse" },
            { val: "3 docs", label: "suffisent" },
            { val: "0 €", label: "pour toujours" },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ color: "#3B82F6", fontSize: 36, fontWeight: 900, margin: 0 }}>{val}</p>
              <p style={{ color: "#475569", fontSize: 18, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </FadeInText>
    </div>
  );
};
