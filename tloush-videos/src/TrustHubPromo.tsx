import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { TH_ProblemScene } from "./scenes/trusthub/TH_ProblemScene";
import { TH_SolutionScene } from "./scenes/trusthub/TH_SolutionScene";
import { TH_HowItWorksScene } from "./scenes/trusthub/TH_HowItWorksScene";
import { TH_ReportScene } from "./scenes/trusthub/TH_ReportScene";
import { TH_StatsScene } from "./scenes/trusthub/TH_StatsScene";
import { TH_DataScene } from "./scenes/trusthub/TH_DataScene";
import { TH_CTAScene } from "./scenes/trusthub/TH_CTAScene";
import "./style.css";

// Durées des scènes (en frames à 30fps)
// Scène 1 : Problème — 6s
// Scène 2 : Solution — 7s
// Scène 3 : How it works — 8s
// Scène 4 : Rapport 3 colonnes — 7s
// Scène 5 : Stats — 6s
// Scène 6 : Data/RGPD — 5s
// Scène 7 : CTA — 6s
// Total scènes : 180+210+240+210+180+150+180 = 1350 frames
// 6 transitions × 20 frames = -120
// Total final : 1230 frames = 41 secondes

const TRANSITION = 20;

const scenes = [
  { component: TH_ProblemScene, duration: 180 },
  { component: TH_SolutionScene, duration: 210 },
  { component: TH_HowItWorksScene, duration: 240 },
  { component: TH_ReportScene, duration: 210 },
  { component: TH_StatsScene, duration: 180 },
  { component: TH_DataScene, duration: 150 },
  { component: TH_CTAScene, duration: 180 },
];

// Alterner entre fade et slide pour varier les transitions
const transitions = [
  fade(),
  slide({ direction: "from-right" }),
  fade(),
  slide({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
];

export const TrustHubPromo: React.FC = () => {
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
                presentation={transitions[i]}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />
            );
          }

          return elements;
        })}
      </TransitionSeries>
    </div>
  );
};
