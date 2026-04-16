import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Logo } from "../components/Logo";
import { FadeInText } from "../components/FadeInText";
import "../style.css";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = spring({
    frame: frame - 60,
    fps,
    config: { damping: 8, stiffness: 100 },
  });
  const btnScale = interpolate(pulse, [0, 1], [0.9, 1]);

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
      <Logo size={100} delay={0} />

      <FadeInText delay={10} direction="up">
        <h1
          style={{
            color: "white",
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            marginTop: 30,
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Reprenez le controle
          <br />
          de vos documents
        </h1>
      </FadeInText>

      <FadeInText delay={30} direction="up">
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 28,
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          Creez votre compte en 30 secondes.
          <br />
          Analysez votre premier document gratuitement.
        </p>
      </FadeInText>

      {/* CTA Button */}
      <FadeInText delay={50} direction="up">
        <div
          style={{
            background: "white",
            borderRadius: 999,
            padding: "20px 48px",
            transform: `scale(${btnScale})`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <span
            style={{
              color: "#2563EB",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Commencer gratuitement
          </span>
        </div>
      </FadeInText>

      {/* URL */}
      <FadeInText delay={75} direction="up">
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 36,
            fontWeight: 700,
            marginTop: 40,
            letterSpacing: 1,
          }}
        >
          tloush.com
        </p>
      </FadeInText>

      <FadeInText delay={85} direction="up">
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 20,
            marginTop: 12,
          }}
        >
          Sans inscription. 100% en francais. Donnees non conservees.
        </p>
      </FadeInText>
    </div>
  );
};
