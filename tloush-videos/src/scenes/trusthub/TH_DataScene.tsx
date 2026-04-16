import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";

export const TH_DataScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    {
      icon: "🔒",
      title: "Vos documents restent vôtres",
      desc: "Stockés chiffrés. Jamais partagés. Supprimables à tout moment.",
      color: "#3B82F6",
      delay: 40,
    },
    {
      icon: "📊",
      title: "La data anonymisée nous permet de rester gratuit",
      desc: "Nous créons le premier benchmark B2B français. Avec votre accord.",
      color: "#8B5CF6",
      delay: 75,
    },
    {
      icon: "🇪🇺",
      title: "RGPD · Hébergé en UE",
      desc: "Supabase Frankfurt. Conformité totale. Opt-in explicite.",
      color: "#10B981",
      delay: 110,
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg, #0F172A 0%, #1E1B4B 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "60px 120px",
        opacity: bgOpacity,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow violet */}
      <div style={{
        position: "absolute",
        top: "30%", left: "50%",
        width: 700, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }} />

      <FadeInText delay={5} direction="up">
        <h2 style={{
          color: "#7C3AED",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 16,
        }}>
          Pourquoi c'est gratuit ?
        </h2>
      </FadeInText>

      <FadeInText delay={15} direction="up">
        <h1 style={{
          color: "white",
          fontSize: 50,
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 60,
          lineHeight: 1.15,
        }}>
          La data est notre modèle.
          <br /><span style={{ color: "#A78BFA" }}>Vous gardez le contrôle.</span>
        </h1>
      </FadeInText>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
        {features.map((f, i) => {
          const prog = spring({ frame: frame - f.delay, fps, config: { damping: 20, stiffness: 160 } });
          const opacity = interpolate(prog, [0, 1], [0, 1]);
          const translateX = interpolate(prog, [0, 1], [100, 0]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${f.color}33`,
                borderRadius: 20,
                padding: "24px 32px",
                opacity,
                transform: `translateX(${translateX}px)`,
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: `${f.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <p style={{ color: "white", fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>{f.title}</p>
                <p style={{ color: "#64748B", fontSize: 20, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
