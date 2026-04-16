import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { PillarsScene } from "./scenes/PillarsScene";
import { StatsScene } from "./scenes/StatsScene";
import { PricingScene } from "./scenes/PricingScene";
import { TrustScene } from "./scenes/TrustScene";
import { CTAScene } from "./scenes/CTAScene";
import "./style.css";

const TRANSITION_DURATION = 15;

const scenes = [
  { component: ProblemScene, duration: 180 },
  { component: SolutionScene, duration: 210 },
  { component: PillarsScene, duration: 240 },
  { component: StatsScene, duration: 180 },
  { component: PricingScene, duration: 180 },
  { component: TrustScene, duration: 150 },
  { component: CTAScene, duration: 150 },
];

export const TloushPromo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const Scene = scene.component;
          const elements: React.ReactNode[] = [
            <TransitionSeries.Sequence
              key={`scene-${i}`}
              durationInFrames={scene.duration}
            >
              <Scene />
            </TransitionSeries.Sequence>,
          ];

          if (i < scenes.length - 1) {
            elements.push(
              <TransitionSeries.Transition
                key={`transition-${i}`}
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: TRANSITION_DURATION,
                })}
              />
            );
          }

          return elements;
        })}
      </TransitionSeries>
    </div>
  );
};
