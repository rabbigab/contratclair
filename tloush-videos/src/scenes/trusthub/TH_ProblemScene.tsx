import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// Mots qui défilent rapidement — les "pièges" classiques des contrats
const TRAP_WORDS = [
  { word: "Tacite reconduction", color: "#EF4444" },
  { word: "Frais de dossier", color: "#F97316" },
  { word: "Indexation abusive", color: "#EF4444" },
  { word: "Préavis 6 mois", color: "#F59E0B" },
  { word: "Frais de restitution", color: "#EF4444" },
  { word: "Hors forfait", color: "#F97316" },
];

function FlashWord({ word, color, startFrame, duration = 18 }: {
  word: string; color: string; startFrame: number; duration?: number;
}) {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const opacity = interpolate(local, [0, 4, duration - 4, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 6], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0 || local > duration) return null;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity,
      transform: `scale(${scale})`,
    }}>
      <span style={{
        color,
        fontSize: 72,
        fontWeight: 900,
        letterSpacing: -1,
        textShadow: `0 0 60px ${color}88`,
        textAlign: "center",
      }}>
        {word}
      </span>
    </div>
  );
}

export const TH_ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-110) : flash des mots-pièges
  // Phase 2 (110-180) : la révélation chiffrée

  const bgOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Fond qui rougit progressivement pendant les flashs
  const redIntensity = interpolate(frame, [0, 90], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne du contrat (barre rayée animée)
  const strikeWidth = interpolate(frame, [128, 150], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse sur le montant réel
  const realAmountPulse = spring({
    frame: frame - 152,
    fps,
    config: { damping: 8, stiffness: 250 },
  });

  // Compteur argent perdu
  const lost = Math.round(
    interpolate(frame, [158, 178], [0, 1440], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#050810",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: bgOpacity,
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Overlay rouge dynamique */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `rgba(239,68,68,${redIntensity})`,
        pointerEvents: "none",
      }} />

      {/* Grille de fond */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
      }} />

      {/* === PHASE 1 : Flash des mots-pièges (frames 0 à 110) === */}
      {frame < 115 && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>

          {/* Accroche fixe en haut */}
          <div style={{
            position: "absolute",
            top: 120,
            left: 0, right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [5, 18], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>
            <span style={{ color: "#475569", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600 }}>
              Votre contrat B2B vous cache…
            </span>
          </div>

          {/* Mots qui clignotent au centre */}
          {TRAP_WORDS.map((item, i) => (
            <FlashWord
              key={i}
              word={item.word}
              color={item.color}
              startFrame={18 + i * 16}
              duration={20}
            />
          ))}

          {/* Compteur de clauses pièges */}
          {frame > 60 && (
            <div style={{
              position: "absolute",
              bottom: 120,
              left: 0, right: 0,
              textAlign: "center",
              opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ color: "#64748B", fontSize: 24 }}>
                🔍 En moyenne{" "}
                <span style={{ color: "#EF4444", fontWeight: 800 }}>
                  {Math.round(interpolate(frame, [65, 95], [0, 4], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  }))}
                </span>{" "}
                clauses problématiques par contrat
              </span>
            </div>
          )}
        </div>
      )}

      {/* === PHASE 2 : La révélation chiffrée (frames 110 à 180) === */}
      {frame >= 108 && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [108, 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [108, 122], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          padding: "0 100px",
        }}>
          <h2 style={{
            color: "#94A3B8",
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 28,
          }}>
            Résultat sur votre facture
          </h2>

          {/* Comparaison contrat vs facture */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "36px 64px",
            marginBottom: 36,
          }}>
            {/* Contrat */}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#64748B", fontSize: 20, margin: "0 0 10px" }}>Le contrat dit</p>
              <div style={{ position: "relative", display: "inline-block" }}>
                <span style={{ color: "#94A3B8", fontSize: 52, fontWeight: 800 }}>100 €</span>
                {/* Ligne biffée */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "-4px",
                  height: 4,
                  width: `${strikeWidth}%`,
                  background: "#EF4444",
                  borderRadius: 2,
                  boxShadow: "0 0 12px #EF444488",
                }} />
              </div>
              <p style={{ color: "#475569", fontSize: 18, margin: "8px 0 0" }}>/mois</p>
            </div>

            {/* Flèche */}
            <div style={{
              fontSize: 48,
              color: "#EF4444",
              opacity: interpolate(frame, [138, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>→</div>

            {/* Facture réelle */}
            <div style={{
              textAlign: "center",
              transform: `scale(${interpolate(realAmountPulse, [0, 1], [0.6, 1])})`,
              opacity: interpolate(realAmountPulse, [0, 1], [0, 1]),
            }}>
              <p style={{ color: "#64748B", fontSize: 20, margin: "0 0 10px" }}>La facture dit</p>
              <span style={{
                color: "#EF4444",
                fontSize: 72,
                fontWeight: 900,
                textShadow: "0 0 40px rgba(239,68,68,0.5)",
              }}>
                124 €
              </span>
              <p style={{ color: "#EF4444", fontSize: 20, margin: "8px 0 0", fontWeight: 700 }}>+24% non annoncé 🔥</p>
            </div>
          </div>

          {/* Calcul annuel animé */}
          {frame >= 156 && (
            <div style={{
              opacity: interpolate(frame, [156, 166], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              textAlign: "center",
            }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 16,
                padding: "16px 40px",
              }}>
                <p style={{ color: "white", fontSize: 28, fontWeight: 800, margin: 0 }}>
                  💸{" "}
                  <span style={{ color: "#EF4444" }}>
                    {lost.toLocaleString("fr-FR")} €
                  </span>{" "}
                  perdus cette année sans le savoir
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
