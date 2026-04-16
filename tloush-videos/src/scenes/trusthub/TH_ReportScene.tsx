import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInText } from "../../components/FadeInText";

const columns = [
  {
    header: "Ce qu'on vous a promis",
    icon: "💬",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
    items: [
      "100 €/mois fixe",
      "Maintenance incluse",
      "Résiliation libre à 3 mois",
      "Pas de frais cachés",
    ],
    delay: 30,
  },
  {
    header: "Ce que vous payez vraiment",
    icon: "🧾",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    items: [
      "124 €/mois (+24%)",
      "Maintenance facturée à part",
      "Préavis 6 mois non dit",
      "+18 €/mois frais de gestion",
    ],
    delay: 60,
  },
  {
    header: "Le plan pour en sortir",
    icon: "🎯",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    items: [
      "Renégocier -20% sous 30j",
      "Exiger la maintenance incluse",
      "Envoyer le préavis avant le 15",
      "Récupérer 1 440 €/an",
    ],
    delay: 90,
  },
];

export const TH_ReportScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#0A0F1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "40px 80px",
        opacity: bgOpacity,
      }}
    >
      {/* Titre */}
      <FadeInText delay={5} direction="up">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#475569", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
            Votre rapport d'audit
          </p>
          <h1 style={{ color: "white", fontSize: 46, fontWeight: 800, margin: 0 }}>
            3 colonnes. Tout est clair.
          </h1>
        </div>
      </FadeInText>

      {/* Colonnes */}
      <div style={{ display: "flex", gap: 24, width: "100%" }}>
        {columns.map((col, i) => {
          const prog = spring({ frame: frame - col.delay, fps, config: { damping: 22, stiffness: 170 } });
          const opacity = interpolate(prog, [0, 1], [0, 1]);
          const translateY = interpolate(prog, [0, 1], [80, 0]);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: col.bg,
                border: `1px solid ${col.border}`,
                borderRadius: 20,
                padding: "28px 24px",
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {/* Header colonne */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: `1px solid ${col.border}`,
              }}>
                <span style={{ fontSize: 32 }}>{col.icon}</span>
                <p style={{
                  color: col.color,
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: 0,
                }}>
                  {col.header}
                </p>
              </div>

              {/* Items */}
              {col.items.map((item, j) => {
                const itemDelay = col.delay + 20 + j * 12;
                const itemProg = spring({ frame: frame - itemDelay, fps, config: { damping: 200 } });
                const itemOpacity = interpolate(itemProg, [0, 1], [0, 1]);

                return (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 14,
                      opacity: itemOpacity,
                    }}
                  >
                    <span style={{ color: col.color, fontSize: 14, marginTop: 3 }}>●</span>
                    <p style={{ color: "#CBD5E1", fontSize: 19, margin: 0, lineHeight: 1.4 }}>{item}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Économies badge */}
      <FadeInText delay={165} direction="up" style={{ marginTop: 36 }}>
        <div style={{
          background: "linear-gradient(135deg, #10B981, #059669)",
          borderRadius: 16,
          padding: "16px 48px",
          boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
        }}>
          <span style={{ color: "white", fontSize: 28, fontWeight: 800 }}>
            💰 Économies identifiées : <strong>1 440 €/an</strong>
          </span>
        </div>
      </FadeInText>
    </div>
  );
};
