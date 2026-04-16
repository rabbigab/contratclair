import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";
import { TrustHubLogo } from "../../components/TrustHubLogo";

export const TH_SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: 80,
        opacity: bgProgress,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cercles décoratifs */}
      <div style={{
        position: "absolute", top: -150, right: -150,
        width: 500, height: 500, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.08)",
      }} />
      <div style={{
        position: "absolute", bottom: -200, left: -200,
        width: 600, height: 600, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.06)",
      }} />

      {/* Logo */}
      <TrustHubLogo size={80} delay={5} dark />

      {/* Tagline principale */}
      <FadeInText delay={20} direction="up" style={{ marginTop: 40 }}>
        <h1
          style={{
            color: "white",
            fontSize: 58,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          L'audit gratuit qui
          <br />
          <span style={{ color: "#93C5FD" }}>protège votre trésorerie</span>
        </h1>
      </FadeInText>

      {/* Sous-titre */}
      <FadeInText delay={40} direction="up">
        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 26,
          textAlign: "center",
          marginBottom: 56,
          lineHeight: 1.5,
        }}>
          Croisez contrat + devis + facture en 5 minutes.
          <br />Notre IA détecte tout ce qu'on vous cache.
        </p>
      </FadeInText>

      {/* 3 pilliers visuels */}
      {[
        { icon: "📋", label: "Contrat", sub: "Clauses pièges & préavis", delay: 65 },
        { icon: "💬", label: "Devis", sub: "Promesses vs réalité", delay: 85 },
        { icon: "🧾", label: "Facture", sub: "Frais cachés détectés", delay: 105 },
      ].map(({ icon, label, sub, delay }, i) => {
        const prog = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 180 } });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 20,
              opacity: interpolate(prog, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(prog, [0, 1], [-80, 0])}px)`,
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30,
            }}>
              {icon}
            </div>
            <div>
              <p style={{ color: "white", fontSize: 28, fontWeight: 700, margin: 0 }}>{label}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, margin: 0 }}>{sub}</p>
            </div>
          </div>
        );
      })}

      {/* Badge gratuit */}
      <FadeInText delay={135} direction="up" style={{ marginTop: 36 }}>
        <div style={{
          background: "#22C55E",
          borderRadius: 999,
          padding: "14px 40px",
          boxShadow: "0 4px 24px rgba(34,197,94,0.35)",
        }}>
          <span style={{ color: "white", fontSize: 26, fontWeight: 800 }}>
            ✅ 100% Gratuit · Pour toujours
          </span>
        </div>
      </FadeInText>
    </div>
  );
};
