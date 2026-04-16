import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Logo: React.FC<{ size?: number; delay?: number }> = ({
  size = 80,
  delay = 0,
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
    <div style={{ opacity, transform: `scale(${scale})` }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.3)",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: size * 0.55,
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1,
          }}
        >
          T
        </span>
      </div>
    </div>
  );
};
