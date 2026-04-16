import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TrustHubLogo: React.FC<{ size?: number; delay?: number; dark?: boolean }> = ({
  size = 80,
  delay = 0,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: "flex", alignItems: "center", gap: size * 0.18 }}>
      {/* Icône shield */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          background: dark
            ? "rgba(255,255,255,0.15)"
            : "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: dark ? "none" : "0 8px 32px rgba(37, 99, 235, 0.35)",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: size * 0.52,
            lineHeight: 1,
          }}
        >
          🛡️
        </span>
      </div>
      {/* Wordmark */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            color: dark ? "white" : "#1E3A8A",
            fontSize: size * 0.55,
            fontWeight: 900,
            fontFamily: "Inter, sans-serif",
            letterSpacing: -1,
          }}
        >
          Trust<span style={{ color: "#2563EB" }}>Hub</span>
        </span>
        <span
          style={{
            color: dark ? "rgba(255,255,255,0.7)" : "#64748B",
            fontSize: size * 0.22,
            fontFamily: "Inter, sans-serif",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Audit B2B
        </span>
      </div>
    </div>
  );
};
