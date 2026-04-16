import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";

function AnimStat({
  target,
  suffix,
  label,
  icon,
  color,
  delay,
  isDecimal = false,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
  delay: number;
  isDecimal?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const val = interpolate(frame, [delay, delay + 60], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const prog = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 180 } });
  const opacity = interpolate(prog, [0, 1], [0, 1]);
  const scale = interpolate(prog, [0, 1], [0.7, 1]);
  const display = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString("fr-FR");

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: 28,
        background: `${color}22`,
        border: `2px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48, marginBottom: 20,
      }}>
        {icon}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ color, fontSize: 64, fontWeight: 900, lineHeight: 1 }}>
          {display}
        </span>
        <span style={{ color, fontSize: 36, fontWeight: 700 }}>{suffix}</span>
      </div>
      <p style={{ color: "#64748B", fontSize: 22, marginTop: 10, textAlign: "center" }}>{label}</p>
    </div>
  );
}

export const TH_StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#070C18",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "60px 100px",
        opacity: bgOpacity,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grille décorative */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <FadeInText delay={5} direction="up">
        <h2 style={{
          color: "#475569",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 16,
        }}>
          TrustHub en chiffres
        </h2>
      </FadeInText>

      <FadeInText delay={12} direction="up">
        <h1 style={{
          color: "white",
          fontSize: 48,
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 70,
        }}>
          Des résultats concrets, pas du blabla
        </h1>
      </FadeInText>

      {/* Stats */}
      <div style={{ display: "flex", gap: 60, width: "100%" }}>
        <AnimStat
          target={1440}
          suffix="€"
          label="économisés en moyenne / an / contrat"
          icon="💰"
          color="#10B981"
          delay={40}
        />
        <AnimStat
          target={5}
          suffix="min"
          label="pour un audit complet"
          icon="⚡"
          color="#3B82F6"
          delay={70}
          isDecimal={false}
        />
        <AnimStat
          target={0}
          suffix="€"
          label="coût pour vous, pour toujours"
          icon="🎁"
          color="#8B5CF6"
          delay={100}
        />
      </div>

      {/* Quote */}
      <FadeInText delay={145} direction="up" style={{ marginTop: 60 }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "20px 48px",
          maxWidth: 900,
          textAlign: "center",
        }}>
          <p style={{ color: "#94A3B8", fontSize: 22, fontStyle: "italic", margin: 0 }}>
            "Monsieur le Client, vous payez 24% de plus que prévu.
            <br />Mon audit gratuit vient de vous faire gagner <strong style={{ color: "#10B981" }}>1 440 €</strong>."
          </p>
        </div>
      </FadeInText>
    </div>
  );
};
