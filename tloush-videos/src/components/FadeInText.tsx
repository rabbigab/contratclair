import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Direction = "up" | "down" | "left" | "right" | "none";

export const FadeInText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, direction = "up", distance = 40, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const translate = interpolate(progress, [0, 1], [distance, 0]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${translate}px)`;
      case "down":
        return `translateY(${-translate}px)`;
      case "left":
        return `translateX(${translate}px)`;
      case "right":
        return `translateX(${-translate}px)`;
      case "none":
        return "none";
    }
  };

  return (
    <div style={{ opacity, transform: getTransform(), ...style }}>
      {children}
    </div>
  );
};
