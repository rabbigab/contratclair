import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedCounter: React.FC<{
  from?: number;
  to: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, delay = 0, suffix = "", prefix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 40, stiffness: 80 },
  });

  const value = Math.round(interpolate(progress, [0, 1], [from, to]));

  return (
    <span style={style}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};
