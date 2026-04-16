import { Composition } from "remotion";
import { TloushPromo } from "./TloushPromo";
import { TrustHubPromo } from "./TrustHubPromo";

// TloushPromo: 7 scenes: 180+210+240+180+180+150+150 = 1290 frames
// Minus 6 transitions of 15 frames = -90 → Total: 1200 frames = 40s

// TrustHubPromo: 7 scenes: 180+210+240+210+180+150+180 = 1350 frames
// Minus 6 transitions of 20 frames = -120 → Total: 1230 frames = 41s

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TloushPromo"
        component={TloushPromo}
        durationInFrames={1200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TrustHubPromo"
        component={TrustHubPromo}
        durationInFrames={1230}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
