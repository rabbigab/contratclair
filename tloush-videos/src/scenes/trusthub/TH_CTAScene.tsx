import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";
import { TrustHubLogo } from "../../components/TrustHubLogo";

export const TH_CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Pulsation du bouton CTA
  const pulse = spring({ frame: frame - 70, fps, config: { damping: 6, stiffness: 80 } });
  const btnScale = interpolate(pulse, [0, 1], [0.85, 1]);

  // Particules flottantes
  const particles = [
    { x: 200, y: 180, delay: 20, emoji: "💰" },
    { x: 1600, y: 250, delay: 35, emoji: "🛡️" },
    { x: 300, y: 700, delay: 50, emoji: "📋" },
    { x: 1650, y: 750, delay: 40, emoji: "✅" },
    { x: 950, y: 100, delay: 60, emoji: "⚡" },
  ];

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 40%, #2563EB 70%, #1E40AF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: 80,
        opacity: bgOpacity,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cercles décoratifs */}
      <div style={{
        position: "absolute", top: -200, right: -200,
        width: 700, height: 700, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.07)",
      }} />
      <div style={{
        position: "absolute", bottom: -300, left: -300,
        width: 800, height: 800, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.05)",
      }} />

      {/* Particules */}
      {particles.map((p, i) => {
        const pOpacity = interpolate(frame - p.delay, [0, 10], [0, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const floatY = Math.sin(frame / 40 + i) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y + floatY,
              fontSize: 40,
              opacity: pOpacity,
            }}
          >
            {p.emoji}
          </div>
        );
      })}

      {/* Logo */}
      <TrustHubLogo size={90} delay={5} dark />

      {/* Headline */}
      <FadeInText delay={20} direction="up" style={{ marginTop: 36, textAlign: "center" }}>
        <h1 style={{
          color: "white",
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 20,
          textAlign: "center",
        }}>
          Arrêtez de payer trop.
          <br />
          <span style={{ color: "#93C5FD" }}>Auditez aujourd'hui.</span>
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
          Uploadez vos 3 documents.
          <br />Notre IA fait le reste en 5 minutes.
        </p>
      </FadeInText>

      {/* CTA Bouton */}
      <FadeInText delay={55} direction="up">
        <div style={{
          background: "white",
          borderRadius: 999,
          padding: "22px 56px",
          transform: `scale(${btnScale})`,
          boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
        }}>
          <span style={{ color: "#1E3A8A", fontSize: 30, fontWeight: 800 }}>
            Démarrer mon audit gratuit →
          </span>
        </div>
      </FadeInText>

      {/* URL */}
      <FadeInText delay={80} direction="up" style={{ marginTop: 44 }}>
        <p style={{
          color: "rgba(255,255,255,0.95)",
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: 1,
        }}>
          trusthub.app
        </p>
      </FadeInText>

      {/* Badges confiance */}
      <FadeInText delay={95} direction="up">
        <div style={{ display: "flex", gap: 32, marginTop: 24 }}>
          {["✅ 100% Gratuit", "🔒 Données sécurisées", "🇪🇺 RGPD · UE"].map((badge, i) => (
            <span key={i} style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 20,
              fontWeight: 500,
            }}>
              {badge}
            </span>
          ))}
        </div>
      </FadeInText>
    </div>
  );
};
