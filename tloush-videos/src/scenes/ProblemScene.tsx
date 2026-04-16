import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["Incompréhensible.", "Frustrante.", "Opaque."];

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: bgOpacity,
        fontFamily: "Inter, sans-serif",
        padding: 80,
      }}
    >
      {/* Hebrew doc emoji */}
      <FadeInText delay={0} direction="none">
        <div style={{ fontSize: 80, marginBottom: 30 }}>📄</div>
      </FadeInText>

      {/* Main question */}
      <FadeInText delay={10} direction="up">
        <h1
          style={{
            color: "white",
            fontSize: 58,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 50,
            lineHeight: 1.2,
          }}
        >
          Votre fiche de paie en hébreu ?
        </h1>
      </FadeInText>

      {/* Pain words appearing one by one */}
      <div style={{ display: "flex", gap: 40 }}>
        {words.map((word, i) => {
          const wordDelay = 40 + i * 20;
          const scale = spring({
            frame: frame - wordDelay,
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          const opacity = interpolate(frame - wordDelay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const colors = ["#F59E0B", "#EF4444", "#DC2626"];

          return (
            <span
              key={word}
              style={{
                color: colors[i],
                fontSize: 42,
                fontWeight: 600,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <FadeInText delay={100} direction="up">
        <p
          style={{
            color: "#94A3B8",
            fontSize: 28,
            marginTop: 50,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Erreurs non detectees. Delais rates. Argent perdu.
        </p>
      </FadeInText>
    </div>
  );
};
