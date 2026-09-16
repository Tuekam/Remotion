import React, { useState } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
// @ts-ignore - asset import handled by the bundler
import logoImport from "../assets/logo.jpeg";

/* =========================================================
   CONSTANTES GLOBALES
   ========================================================= */

const FPS = 30;
const W = 1080;
const H = 1920;
const DUR = 1230; // 41 s

const C = {
  blue: "#004369",
  blueDeep: "#003454",
  blueInk: "#00243A",
  orange: "#DA6220",
  white: "#FFFFFF",
  paper: "#F3F7FA",
  mist: "#E3ECF3",
  slate: "#5D7688",
  line: "#C9D9E4",
};

const F_DISPLAY =
  "'Lucky Bones', 'Nunito', 'Segoe UI', Helvetica, Arial, sans-serif";
const F_TEXT = "'Nunito', 'Segoe UI', Helvetica, Arial, sans-serif";

const SAFE = 96;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/* =========================================================
   HELPERS D'ANIMATION
   ========================================================= */

const A = (
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing: (t: number) => number = EASE_OUT
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const S = (
  frame: number,
  delay = 0,
  damping = 22,
  stiffness = 120,
  mass = 0.9
) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping, stiffness, mass },
  });

type Dir = "bottom" | "top" | "left" | "right";

const insetFor = (p: number, from: Dir) => {
  const v = Math.max(0, Math.min(100, (1 - p) * 100));
  if (from === "bottom") return `${v}% 0% 0% 0%`;
  if (from === "top") return `0% 0% ${v}% 0%`;
  if (from === "left") return `0% ${v}% 0% 0%`;
  return `0% 0% 0% ${v}%`;
};

const Reveal: React.FC<{
  p: number;
  from?: Dir;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ p, from = "bottom", children, style }) => (
  <div style={{ ...style, clipPath: `inset(${insetFor(p, from)})` }}>
    {children}
  </div>
);

/* =========================================================
   LOGO (asset officiel, proportions intactes)
   maxWidth/maxHeight seuls sont contraints (jamais width+height
   fixes ensemble) afin que le ratio d'origine soit TOUJOURS
   préservé, quelle que soit la vraie forme du fichier source.
   ========================================================= */

const LOGO_SOURCES: string[] = [
  (logoImport as unknown as string) || "",
  staticFile("assets/logo.jpeg"),
  "assets/logo.jpeg",
].filter(Boolean) as string[];

const Logo: React.FC<{
  width: number;
  maxHeight?: number;
  style?: React.CSSProperties;
}> = ({ width, maxHeight, style }) => {
  const [i, setI] = useState(0);
  const src = LOGO_SOURCES[Math.min(i, LOGO_SOURCES.length - 1)];
  return (
    <Img
      src={src}
      onError={() => setI((x) => x + 1)}
      style={{
        width: "auto",
        height: "auto",
        maxWidth: width,
        maxHeight,
        display: "block",
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
};

/* =========================================================
   FONDS
   ========================================================= */

const GridLines: React.FC<{
  color: string;
  opacity: number;
  size?: number;
  id: string;
}> = ({ color, opacity, size = 90, id }) => (
  <svg
    width={W}
    height={H}
    style={{ position: "absolute", left: 0, top: 0, opacity }}
  >
    <defs>
      <pattern
        id={id}
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M ${size} 0 L 0 0 0 ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={1}
        />
      </pattern>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </svg>
);

const LightBackdrop: React.FC<{ abs: number; id: string }> = ({ abs, id }) => {
  const d1 = Math.sin(abs / 150) * 60;
  const d2 = Math.cos(abs / 190) * 80;
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          left: -380 + d1,
          top: -300 - d2 * 0.4,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,67,105,0.10), rgba(0,67,105,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -320 - d2,
          bottom: -260 + d1 * 0.5,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(218,98,32,0.10), rgba(218,98,32,0) 70%)",
        }}
      />
      <GridLines id={id} color={C.blue} opacity={0.05} size={90} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0) 45%, rgba(0,36,58,0.10) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const DeepBackdrop: React.FC<{ abs: number; id: string }> = ({ abs, id }) => {
  const d1 = Math.sin(abs / 160) * 70;
  const d2 = Math.cos(abs / 210) * 90;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${C.blue} 0%, ${C.blueDeep} 45%, ${C.blueInk} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -420 - d2 * 0.6,
          top: -420 + d1,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), rgba(255,255,255,0) 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -380 + d1,
          bottom: -380 - d2 * 0.4,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(218,98,32,0.20), rgba(218,98,32,0) 70%)",
        }}
      />
      <GridLines id={id} color={C.white} opacity={0.06} size={120} />
    </AbsoluteFill>
  );
};

/* =========================================================
   TYPOGRAPHIE CINÉTIQUE
   ========================================================= */

const clean = (w: string) => w.replace(/[.,?!:;«»"']/g, "");

const Headline: React.FC<{
  text: string;
  frame: number;
  delay?: number;
  size?: number;
  color?: string;
  accent?: string[];
  align?: "left" | "center";
  stagger?: number;
  maxWidth?: number;
  weight?: number;
  tracking?: number;
}> = ({
  text,
  frame,
  delay = 0,
  size = 96,
  color = C.blue,
  accent = [],
  align = "left",
  stagger = 3,
  maxWidth,
  weight = 800,
  tracking = -2,
}) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: `${Math.round(size * 0.06)}px ${Math.round(size * 0.26)}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth,
        fontFamily: F_DISPLAY,
      }}
    >
      {words.map((w, i) => {
        const p = S(frame, delay + i * stagger, 24, 135, 0.8);
        const isAccent = accent.indexOf(clean(w)) >= 0;
        return (
          <span key={i} style={{ overflow: "hidden", display: "block" }}>
            <span
              style={{
                display: "block",
                transform: `translateY(${(1 - p) * 115}%)`,
                fontSize: size,
                lineHeight: 1.14,
                fontWeight: weight,
                letterSpacing: tracking,
                color: isAccent ? C.orange : color,
                whiteSpace: "pre",
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const Kicker: React.FC<{
  text: string;
  frame: number;
  delay?: number;
  color?: string;
  lineColor?: string;
  size?: number;
}> = ({
  text,
  frame,
  delay = 0,
  color = C.slate,
  lineColor = C.orange,
  size = 24,
}) => {
  const lw = A(frame, delay, delay + 16, 0, 64);
  const p = S(frame, delay + 6, 26, 140, 0.8);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: lw, height: 3, backgroundColor: lineColor }} />
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            transform: `translateY(${(1 - p) * 120}%)`,
            fontFamily: F_TEXT,
            fontSize: size,
            fontWeight: 700,
            letterSpacing: 7,
            color,
            textTransform: "uppercase",
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

const SubText: React.FC<{
  text: string;
  frame: number;
  delay?: number;
  color?: string;
  size?: number;
  maxWidth?: number;
  align?: "left" | "center";
}> = ({
  text,
  frame,
  delay = 0,
  color = C.slate,
  size = 30,
  maxWidth = 640,
  align = "left",
}) => {
  const p = S(frame, delay, 26, 120, 0.9);
  return (
    <div style={{ overflow: "hidden", maxWidth }}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 110}%)`,
          opacity: A(frame, delay, delay + 8, 0, 1),
          fontFamily: F_TEXT,
          fontSize: size,
          lineHeight: 1.45,
          fontWeight: 600,
          color,
          textAlign: align,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* =========================================================
   UI E-COMMERCE (fictive mais crédible)
   ========================================================= */

const ShopCard: React.FC<{ f: number; withCursor?: boolean }> = ({
  f,
  withCursor = true,
}) => {
  const enter = S(f, 0, 21, 110, 0.95);
  const imgP = S(f, 8, 24, 120, 0.8);
  const shim = A(f, 14, 46, -40, 140, EASE_IN_OUT);
  const price = Math.round(A(f, 22, 48, 0, 249));
  const priceP = S(f, 22, 24, 130, 0.8);
  const btnP = S(f, 32, 22, 125, 0.8);
  const cursorP = A(f, 44, 64, 0, 1, EASE_IN_OUT);
  const press =
    A(f, 64, 69, 0, 1, EASE_IN_OUT) - A(f, 69, 78, 0, 1, EASE_IN_OUT);
  const badge = S(f, 70, 14, 180, 0.6);
  const lineP = A(f, 26, 44, 0, 1);

  return (
    <div
      style={{
        width: 620,
        borderRadius: 34,
        backgroundColor: C.white,
        boxShadow:
          "0 40px 90px rgba(0,36,58,0.16), 0 6px 18px rgba(0,36,58,0.06)",
        overflow: "hidden",
        transform: `translateY(${(1 - enter) * 90}px) scale(${
          0.94 + enter * 0.06
        })`,
        opacity: A(f, 0, 6, 0, 1),
        border: `1px solid ${C.mist}`,
      }}
    >
      {/* barre d'interface */}
      <div
        style={{
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: `1px solid ${C.mist}`,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: C.line,
                opacity: A(f, 2 + i * 2, 10 + i * 2, 0, 1),
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            margin: "0 22px",
            height: 34,
            borderRadius: 17,
            backgroundColor: C.paper,
            transform: `scaleX(${A(f, 3, 16, 0.4, 1)})`,
          }}
        />
        <div style={{ position: "relative" }}>
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path
              d="M3 4h3l2.5 11h9L20 7H7"
              fill="none"
              stroke={C.blue}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={10} cy={19} r={1.6} fill={C.blue} />
            <circle cx={17} cy={19} r={1.6} fill={C.blue} />
          </svg>
          <div
            style={{
              position: "absolute",
              right: -8,
              top: -8,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: C.orange,
              color: C.white,
              fontFamily: F_TEXT,
              fontSize: 13,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${Math.max(0, badge)})`,
            }}
          >
            1
          </div>
        </div>
      </div>

      {/* visuel produit abstrait */}
      <div
        style={{
          height: 420,
          margin: 24,
          borderRadius: 26,
          background: `linear-gradient(150deg, ${C.mist} 0%, ${C.paper} 60%, #FFFFFF 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%,-50%) scale(${0.82 + imgP * 0.18})`,
            opacity: imgP,
          }}
        >
          <svg width={300} height={300} viewBox="0 0 300 300">
            <circle cx={150} cy={150} r={112} fill="rgba(0,67,105,0.07)" />
            <rect
              x={92}
              y={62}
              width={116}
              height={176}
              rx={26}
              fill="none"
              stroke={C.blue}
              strokeWidth={4}
            />
            <rect
              x={112}
              y={92}
              width={76}
              height={8}
              rx={4}
              fill="rgba(0,67,105,0.35)"
            />
            <rect
              x={112}
              y={116}
              width={48}
              height={8}
              rx={4}
              fill="rgba(0,67,105,0.2)"
            />
            <circle cx={150} cy={196} r={20} fill={C.orange} opacity={0.9} />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            top: -80,
            bottom: -80,
            left: `${shim}%`,
            width: 160,
            transform: "rotate(14deg)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      {/* informations */}
      <div style={{ padding: "0 34px 34px" }}>
        <div
          style={{
            fontFamily: F_TEXT,
            fontSize: 20,
            letterSpacing: 6,
            fontWeight: 700,
            color: C.slate,
            opacity: A(f, 18, 28, 0, 1),
          }}
        >
          PRODUCT
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                transform: `translateY(${(1 - priceP) * 110}%)`,
                fontFamily: F_DISPLAY,
                fontSize: 78,
                fontWeight: 800,
                color: C.blue,
                letterSpacing: -2,
                lineHeight: 1.15,
              }}
            >
              {"\u20AC" + price}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i < 4 ? C.orange : C.line,
                  transform: `scaleX(${S(f, 24 + i * 2, 20, 160, 0.7)})`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            height: 1,
            backgroundColor: C.mist,
            transform: `scaleX(${lineP})`,
            transformOrigin: "left center",
            margin: "18px 0 26px",
          }}
        />

        <div
          style={{
            height: 92,
            borderRadius: 46,
            backgroundColor: press > 0.15 ? C.orange : C.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${(1 - btnP) * 40}px) scale(${
              (0.92 + btnP * 0.08) * (1 - press * 0.04)
            })`,
            opacity: A(f, 32, 40, 0, 1),
            boxShadow:
              press > 0.15
                ? "0 16px 36px rgba(218,98,32,0.35)"
                : "0 16px 36px rgba(0,67,105,0.22)",
          }}
        >
          <span
            style={{
              fontFamily: F_TEXT,
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: 5,
              color: C.white,
            }}
          >
            ADD TO CART
          </span>
        </div>
      </div>

      {withCursor ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${A(
              cursorP,
              0,
              1,
              560,
              316
            )}px, ${A(cursorP, 0, 1, 980, 856)}px) scale(${
              1 - press * 0.18
            })`,
            opacity: A(f, 42, 50, 0, 1) * A(f, 88, 100, 1, 0),
          }}
        >
          <svg width={40} height={44} viewBox="0 0 24 26">
            <path
              d="M4 2 L4 20 L9 15.5 L12.5 23 L15.8 21.5 L12.4 14.3 L19 14 Z"
              fill={C.blueInk}
              stroke={C.white}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

const Chip: React.FC<{
  label: string;
  f: number;
  delay: number;
  active?: boolean;
  dark?: boolean;
}> = ({ label, f, delay, active = false, dark = true }) => {
  const p = S(f, delay, 21, 130, 0.8);
  return (
    <div
      style={{
        transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + p * 0.1})`,
        opacity: A(f, delay, delay + 7, 0, 1),
        padding: "20px 34px",
        borderRadius: 20,
        backgroundColor: active
          ? C.orange
          : dark
          ? "rgba(255,255,255,0.08)"
          : C.white,
        border: `1px solid ${
          active
            ? C.orange
            : dark
            ? "rgba(255,255,255,0.22)"
            : C.mist
        }`,
        backdropFilter: "blur(6px)",
        fontFamily: F_TEXT,
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 4,
        color: dark ? C.white : C.blue,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

/* =========================================================
   TRAJET EUROPE -> CAMEROUN
   Points déplacés vers le bas de la composition pour ne
   jamais croiser le bloc de titre (qui occupe le haut de
   l'écran, top ~260 à ~570 environ).
   ========================================================= */

const P0 = { x: 210, y: 760 };
const P1 = { x: 960, y: 1040 };
const P2 = { x: 760, y: 1480 };

const bezPoint = (t: number) => ({
  x: (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
  y: (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
});

const PATH_LEN = (() => {
  let len = 0;
  let prev = bezPoint(0);
  for (let i = 1; i <= 120; i++) {
    const p = bezPoint(i / 120);
    len += Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
    prev = p;
  }
  return len;
})();

const PATH_D = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;

const PackageBox: React.FC<{ x: number; y: number; rot: number; s: number }> = ({
  x,
  y,
  rot,
  s,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect
      x={-52}
      y={-46}
      width={104}
      height={92}
      rx={16}
      fill={C.white}
      opacity={0.98}
    />
    <rect
      x={-52}
      y={-46}
      width={104}
      height={92}
      rx={16}
      fill="none"
      stroke={C.blue}
      strokeWidth={3}
      opacity={0.35}
    />
    <rect x={-12} y={-46} width={24} height={92} fill={C.orange} opacity={0.9} />
    <rect x={-52} y={-8} width={104} height={5} fill={C.blue} opacity={0.18} />
  </g>
);

/* =========================================================
   SCÈNE 1 — HOOK
   ========================================================= */

const Scene1: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const drift = A(f, 0, 130, 0, -26, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <LightBackdrop abs={abs} id="g-s1" />

      {/* carte fantôme (profondeur) — décalée pour ne
          laisser qu'un très léger recouvrement décoratif */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 460 + drift * 0.4,
          width: 300,
          height: 440,
          borderRadius: 30,
          backgroundColor: C.white,
          opacity: A(f, 6, 24, 0, 0.4),
          border: `1px solid ${C.mist}`,
          boxShadow: "0 30px 60px rgba(0,36,58,0.08)",
          transform: `scale(${A(f, 6, 30, 0.9, 1)}) rotate(-3deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 372,
          top: 250 + drift,
          transform: "rotate(-1.4deg)",
        }}
      >
        <ShopCard f={f} />
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 1290 }}>
        <Kicker text="E-commerce Europe" frame={f} delay={46} />
        <div style={{ height: 26 }} />
        <Headline
          text="UN PRODUIT"
          frame={f}
          delay={54}
          size={118}
          maxWidth={900}
        />
        <Headline
          text="EN EUROPE ?"
          frame={f}
          delay={62}
          size={118}
          accent={["EUROPE"]}
          maxWidth={900}
        />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCÈNE 2 — LE PROBLÈME
   ========================================================= */

const Scene2: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const wipe = A(f, 0, 16, 0, 1, EASE_IN_OUT);

  const chips = [
    { label: "PAIEMENT", x: 92, y: 760, d: 26 },
    { label: "ADRESSE", x: 560, y: 900, d: 34 },
    { label: "EXPÉDITION", x: 140, y: 1040, d: 42 },
    { label: "CAMEROUN", x: 600, y: 1180, d: 50 },
  ];

  const linkP = A(f, 46, 86, 0, 1, EASE_IN_OUT);
  const pulse = A(f, 60, 100, 0, 1, EASE_IN_OUT);

  const swap = A(f, 104, 116, 0, 1, EASE_IN_OUT);

  return (
    <Reveal p={wipe} from="bottom" style={{ position: "absolute", inset: 0 }}>
      <AbsoluteFill>
        <DeepBackdrop abs={abs} id="g-s2" />

        {/* la fiche produit devient une vignette en haut */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 190,
            transform: `scale(${A(f, 0, 22, 0.52, 0.42)})`,
            transformOrigin: "top right",
            opacity: A(f, 0, 10, 0, 1),
            filter: "saturate(0.95)",
          }}
        >
          <ShopCard f={100} withCursor={false} />
        </div>

        <div style={{ position: "absolute", left: SAFE, top: 200 }}>
          <Kicker
            text="Votre commande"
            frame={f}
            delay={8}
            color="rgba(255,255,255,0.7)"
          />
        </div>

        {/* connecteurs */}
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d="M 300 812 L 700 952 L 360 1092 L 800 1232"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
            strokeDasharray={1600}
            strokeDashoffset={1600 * (1 - linkP)}
          />
          <circle
            cx={interpolate(pulse, [0, 0.33, 0.66, 1], [300, 700, 360, 800])}
            cy={interpolate(pulse, [0, 0.33, 0.66, 1], [812, 952, 1092, 1232])}
            r={9}
            fill={C.orange}
            opacity={pulse > 0 && pulse < 1 ? 1 : 0}
          />
        </svg>

        {chips.map((c) => (
          <div
            key={c.label}
            style={{ position: "absolute", left: c.x, top: c.y }}
          >
            <Chip
              label={c.label}
              f={f}
              delay={c.d}
              active={c.label === "CAMEROUN" && f > 96}
            />
          </div>
        ))}

        {/* typo qui se remplace */}
        <div style={{ position: "absolute", left: SAFE, top: 380 }}>
          <div
            style={{
              transform: `translateY(${-swap * 90}px)`,
              opacity: 1 - swap,
            }}
          >
            <Headline
              text="ACHETER EN EUROPE,"
              frame={f}
              delay={14}
              size={84}
              color={C.white}
              accent={["EUROPE"]}
              maxWidth={900}
            />
            <Headline
              text="DEPUIS LE CAMEROUN..."
              frame={f}
              delay={22}
              size={84}
              color={C.white}
              maxWidth={900}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: swap,
            }}
          >
            <Headline
              text="...PEUT DEVENIR"
              frame={f}
              delay={106}
              size={84}
              color={C.white}
              maxWidth={900}
            />
            <Headline
              text="COMPLIQUÉ."
              frame={f}
              delay={112}
              size={84}
              color={C.white}
              accent={["COMPLIQUÉ"]}
              maxWidth={900}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Reveal>
  );
};

/* =========================================================
   SCÈNE 3 — APPARITION D'OLOSTO
   Le bloc logo / ligne / texte est désormais empilé en flux
   normal (flex column + marginTop), jamais en position
   absolue superposée : aucune collision possible, quelle
   que soit la forme réelle du logo.
   ========================================================= */

const Scene3: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;

  const conv = A(f, 0, 20, 0, 1, EASE_IN_OUT);
  const circle = A(f, 14, 40, 0, 1, EASE_IN_OUT);
  const logoP = S(f, 40, 24, 110, 0.9);
  const lineP = A(f, 62, 82, 0, 320, EASE_OUT);
  const ring = A(f, 44, 86, 0, 1, EASE_OUT);

  const ghosts = [
    { x: 150, y: 640 },
    { x: 760, y: 720 },
    { x: 220, y: 1120 },
    { x: 820, y: 1220 },
  ];

  return (
    <AbsoluteFill>
      {/* on continue le fond profond puis le blanc s'ouvre */}
      <DeepBackdrop abs={abs} id="g-s3" />

      {ghosts.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.x + (540 - g.x) * conv,
            top: g.y + (960 - g.y) * conv,
            width: 180,
            height: 60,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(255,255,255,0.06)",
            transform: `scale(${1 - conv})`,
            opacity: 1 - conv,
          }}
        />
      ))}

      <AbsoluteFill
        style={{
          clipPath: `circle(${circle * 130}% at 50% 50%)`,
        }}
      >
        <LightBackdrop abs={abs} id="g-s3b" />

        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* anneaux subtils */}
          <svg
            width={W}
            height={H}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <circle
              cx={540}
              cy={960}
              r={260 + ring * 120}
              fill="none"
              stroke={C.blue}
              strokeWidth={1}
              opacity={0.18 * (1 - ring)}
            />
            <circle
              cx={540}
              cy={960}
              r={200 + ring * 220}
              fill="none"
              stroke={C.orange}
              strokeWidth={1}
              opacity={0.16 * (1 - ring)}
            />
          </svg>

          {/* bloc empilé : logo -> ligne -> texte, toujours
              séparés par des marges fixes, jamais superposés */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Reveal p={Math.min(1, logoP * 1.2)} from="bottom">
              <div
                style={{
                  transform: `scale(${0.9 + logoP * 0.1})`,
                  padding: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Logo width={520} maxHeight={220} />
              </div>
            </Reveal>

            <div
              style={{
                marginTop: 46,
                width: lineP,
                height: 4,
                backgroundColor: C.orange,
              }}
            />

            <div style={{ marginTop: 42 }}>
              <Headline
                text="VOTRE FACILITATEUR D'ACHAT."
                frame={f}
                delay={78}
                size={52}
                align="center"
                maxWidth={860}
                tracking={0}
                accent={["D'ACHAT"]}
              />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCÈNE 4A — ÉTAPE 1 : VOUS CHOISISSEZ
   ========================================================= */

const Scene4a: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const wipe = A(f, 0, 14, 0, 1, EASE_IN_OUT);
  const slide = S(f, 4, 24, 105, 1);
  const out = A(f, 92, 110, 0, 1, EASE_IN_OUT);

  return (
    <Reveal p={wipe} from="right" style={{ position: "absolute", inset: 0 }}>
      <AbsoluteFill>
        <LightBackdrop abs={abs} id="g-s4a" />

        <div
          style={{
            position: "absolute",
            left: 420 + (1 - slide) * 620 - out * 260,
            top: 300,
            transform: `scale(${0.86 - out * 0.06}) rotate(${
              2 - slide * 3.4
            }deg)`,
            transformOrigin: "top left",
            opacity: 1 - out * 0.6,
          }}
        >
          <ShopCard f={f + 30} withCursor={false} />
        </div>

        <div
          style={{
            position: "absolute",
            left: SAFE,
            top: 1200,
            opacity: 1 - out,
            transform: `translateY(${-out * 60}px)`,
          }}
        >
          <Kicker text="Étape 01" frame={f} delay={16} />
          <div style={{ height: 24 }} />
          <Headline
            text="VOUS CHOISISSEZ"
            frame={f}
            delay={22}
            size={104}
            maxWidth={900}
            accent={["CHOISISSEZ"]}
          />
          <div style={{ height: 26 }} />
          <SubText
            text="Votre produit, sur votre site européen préféré."
            frame={f}
            delay={40}
            maxWidth={700}
          />
        </div>
      </AbsoluteFill>
    </Reveal>
  );
};

/* =========================================================
   SCÈNE 4B — ÉTAPE 2 : OLOSTO PREND LE RELAIS
   ========================================================= */

const Scene4b: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;

  const nodeP = S(f, 10, 22, 115, 0.9);
  const linkP = A(f, 26, 54, 0, 1, EASE_IN_OUT);
  const pulse = A(f, 40, 76, 0, 1, EASE_IN_OUT);
  const out = A(f, 92, 108, 0, 1, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <LightBackdrop abs={abs} id="g-s4b" />

      {/* mini carte e-commerce à gauche */}
      <div
        style={{
          position: "absolute",
          left: 70 - out * 120,
          top: 420,
          transform: "scale(0.46) rotate(-2deg)",
          transformOrigin: "top left",
          opacity: A(f, 0, 8, 0, 1) * (1 - out * 0.7),
        }}
      >
        <ShopCard f={120} withCursor={false} />
      </div>

      {/* liaison orange */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M 420 700 C 540 700, 560 640, 660 640"
          fill="none"
          stroke={C.orange}
          strokeWidth={4}
          strokeDasharray={320}
          strokeDashoffset={320 * (1 - linkP)}
          strokeLinecap="round"
        />
        <circle
          cx={interpolate(pulse, [0, 1], [420, 660])}
          cy={interpolate(pulse, [0, 0.5, 1], [700, 662, 640])}
          r={10}
          fill={C.orange}
          opacity={pulse > 0.02 && pulse < 0.99 ? 1 : 0}
        />
      </svg>

      {/* noeud OLOSTO */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: 500,
          width: 330,
          height: 330,
          borderRadius: 40,
          backgroundColor: C.white,
          border: `1px solid ${C.mist}`,
          boxShadow: "0 40px 80px rgba(0,36,58,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${(1 - nodeP) * 260}px) scale(${
            0.92 + nodeP * 0.08
          })`,
          opacity: A(f, 10, 18, 0, 1) * (1 - out * 0.5),
        }}
      >
        <Logo width={220} maxHeight={220} />
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 1150,
          opacity: 1 - out,
          transform: `translateY(${-out * 60}px)`,
        }}
      >
        <Kicker text="Étape 02" frame={f} delay={18} />
        <div style={{ height: 24 }} />
        <Headline
          text="OLOSTO PREND"
          frame={f}
          delay={24}
          size={104}
          maxWidth={900}
        />
        <Headline
          text="LE RELAIS"
          frame={f}
          delay={30}
          size={104}
          maxWidth={900}
          accent={["RELAIS"]}
        />
        <div style={{ height: 26 }} />
        <SubText
          text="Nous facilitons votre achat."
          frame={f}
          delay={46}
          maxWidth={700}
        />
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================
   SCÈNE 4C — LE VOYAGE EUROPE -> CAMEROUN
   ========================================================= */

const Scene4c: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const wipe = A(f, 0, 16, 0, 1, EASE_IN_OUT);

  const draw = A(f, 14, 70, 0, 1, EASE_IN_OUT);
  const travel = A(f, 22, 122, 0, 1, EASE_IN_OUT);
  const pt = bezPoint(travel);
  const boxIn = S(f, 18, 20, 150, 0.7);
  const land = A(f, 118, 132, 0, 1, EASE_OUT);
  const ring1 = A(f, 124, 168, 0, 1, EASE_OUT);
  const ring2 = A(f, 134, 178, 0, 1, EASE_OUT);
  const check = A(f, 136, 156, 0, 1, EASE_OUT);
  const swap = A(f, 118, 130, 0, 1, EASE_IN_OUT);

  const dotA = S(f, 8, 20, 150, 0.7);
  const dotB = S(f, 14, 20, 150, 0.7);

  return (
    <Reveal p={wipe} from="bottom" style={{ position: "absolute", inset: 0 }}>
      <AbsoluteFill>
        <DeepBackdrop abs={abs} id="g-s4c" />

        <svg
          width={W}
          height={H}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {/* trajectoire */}
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={2}
            strokeDasharray="10 14"
          />
          <path
            d={PATH_D}
            fill="none"
            stroke={C.orange}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={PATH_LEN}
            strokeDashoffset={PATH_LEN * (1 - draw)}
          />

          {/* particules discrètes */}
          {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
            const p = bezPoint(t);
            const visible = travel > t ? 1 : 0;
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill={C.white}
                opacity={visible * 0.35}
              />
            );
          })}

          {/* point Europe */}
          <circle
            cx={P0.x}
            cy={P0.y}
            r={16 * dotA}
            fill={C.white}
          />
          <circle
            cx={P0.x}
            cy={P0.y}
            r={16 * dotA + 22}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
          />

          {/* point Cameroun */}
          <circle cx={P2.x} cy={P2.y} r={16 * dotB} fill={C.orange} />
          <circle
            cx={P2.x}
            cy={P2.y}
            r={38 + ring1 * 90}
            fill="none"
            stroke={C.orange}
            strokeWidth={2}
            opacity={0.55 * (1 - ring1)}
          />
          <circle
            cx={P2.x}
            cy={P2.y}
            r={38 + ring2 * 130}
            fill="none"
            stroke={C.white}
            strokeWidth={1.5}
            opacity={0.35 * (1 - ring2)}
          />

          {/* colis */}
          <PackageBox
            x={pt.x}
            y={pt.y - (1 - land) * 0}
            rot={Math.sin(travel * Math.PI) * 7}
            s={(0.6 + boxIn * 0.4) * (1 + land * 0.06 - land * land * 0.06)}
          />

          {/* confirmation */}
          <path
            d={`M ${P2.x - 22} ${P2.y + 2} l 16 17 l 30 -34`}
            fill="none"
            stroke={C.white}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={80}
            strokeDashoffset={80 * (1 - check)}
            opacity={check}
          />
        </svg>

        {/* labels */}
        <div
          style={{
            position: "absolute",
            left: P0.x - 6,
            top: P0.y - 78,
            opacity: A(f, 10, 22, 0, 1),
            fontFamily: F_TEXT,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 7,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          EUROPE
        </div>
        <div
          style={{
            position: "absolute",
            left: P2.x - 6,
            top: P2.y + 62,
            opacity: A(f, 16, 28, 0, 1),
            fontFamily: F_TEXT,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 7,
            color: C.orange,
          }}
        >
          CAMEROUN
        </div>

        {/* typo */}
        <div style={{ position: "absolute", left: SAFE, top: 260 }}>
          <div
            style={{
              opacity: 1 - swap,
              transform: `translateY(${-swap * 60}px)`,
            }}
          >
            <Kicker
              text="Étape 03"
              frame={f}
              delay={16}
              color="rgba(255,255,255,0.7)"
            />
            <div style={{ height: 24 }} />
            <Headline
              text="VOTRE COLIS"
              frame={f}
              delay={22}
              size={104}
              color={C.white}
            />
            <Headline
              text="VOYAGE"
              frame={f}
              delay={28}
              size={104}
              color={C.white}
              accent={["VOYAGE"]}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: swap,
            }}
          >
            <Kicker
              text="Étape 04"
              frame={f}
              delay={120}
              color="rgba(255,255,255,0.7)"
            />
            <div style={{ height: 24 }} />
            <Headline
              text="JUSQU'AU"
              frame={f}
              delay={126}
              size={104}
              color={C.white}
            />
            <Headline
              text="CAMEROUN."
              frame={f}
              delay={132}
              size={104}
              color={C.white}
              accent={["CAMEROUN"]}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Reveal>
  );
};

/* =========================================================
   SCÈNE 5 — PROMESSE
   ========================================================= */

const Scene5: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const wipe = A(f, 0, 18, 0, 1, EASE_IN_OUT);
  const zoom = A(f, 0, 250, 1, 1.05, EASE_IN_OUT);
  const lift = S(f, 72, 26, 110, 1);
  const rule = A(f, 128, 152, 0, 460, EASE_OUT);
  const out = A(f, 228, 250, 0, 1, EASE_IN_OUT);

  return (
    <Reveal p={wipe} from="top" style={{ position: "absolute", inset: 0 }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <LightBackdrop abs={abs} id="g-s5" />

        <div
          style={{
            position: "absolute",
            left: SAFE,
            top: 640,
            opacity: 1 - out * 0.8,
          }}
        >
          <div style={{ transform: `translateY(${-lift * 130}px)` }}>
            <Headline
              text="ACHETEZ EN EUROPE."
              frame={f}
              delay={14}
              size={112}
              accent={["EUROPE"]}
              maxWidth={900}
            />
          </div>

          <div
            style={{
              marginTop: 30,
              transform: `translateY(${-lift * 130}px)`,
            }}
          >
            <Headline
              text="NOUS NOUS OCCUPONS DU RESTE."
              frame={f}
              delay={78}
              size={112}
              accent={["RESTE"]}
              maxWidth={920}
            />
          </div>

          <div
            style={{
              marginTop: 40,
              transform: `translateY(${-lift * 130}px)`,
            }}
          >
            <div
              style={{ width: rule, height: 3, backgroundColor: C.orange }}
            />
            <div style={{ height: 34 }} />
            <SubText
              text="Du panier à l'acheminement, OLOSTO simplifie vos achats internationaux."
              frame={f}
              delay={148}
              size={34}
              maxWidth={760}
            />
          </div>
        </div>
      </AbsoluteFill>
    </Reveal>
  );
};

/* =========================================================
   SCÈNE 6 — FINAL / CTA
   ========================================================= */

const SwapWord: React.FC<{
  f: number;
  text: string;
  inAt: number;
  outAt: number;
  accent?: string[];
}> = ({ f, text, inAt, outAt, accent = [] }) => {
  const outP = A(f, outAt, outAt + 10, 0, 1, EASE_IN_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateY(${-outP * 120}px)`,
        opacity: 1 - outP,
      }}
    >
      <Headline
        text={text}
        frame={f}
        delay={inAt}
        size={112}
        color={C.white}
        accent={accent}
        maxWidth={920}
      />
    </div>
  );
};

const Scene6: React.FC<{ startAt: number }> = ({ startAt }) => {
  const f = useCurrentFrame();
  const abs = f + startAt;
  const wipe = A(f, 0, 16, 0, 1, EASE_IN_OUT);

  const panel = A(f, 88, 112, 0, 1, EASE_IN_OUT);
  const logoP = S(f, 100, 24, 105, 0.95);
  const rule = A(f, 124, 146, 0, 300, EASE_OUT);
  const ctaP = S(f, 138, 26, 115, 0.9);

  return (
    <Reveal p={wipe} from="left" style={{ position: "absolute", inset: 0 }}>
      <AbsoluteFill>
        <DeepBackdrop abs={abs} id="g-s6" />

        <div style={{ position: "absolute", left: SAFE, top: 820 }}>
          <SwapWord f={f} text="VOS ACHATS EUROPÉENS." inAt={8} outAt={34} />
          <SwapWord
            f={f}
            text="PLUS SIMPLES."
            inAt={40}
            outAt={62}
            accent={["SIMPLES"]}
          />
          <SwapWord f={f} text="AVEC OLOSTO." inAt={68} outAt={92} />
        </div>

        {/* panneau final clair — logo, règle et CTA empilés en
            flux normal (marginTop), aucune superposition possible */}
        <Reveal p={panel} from="bottom" style={{ position: "absolute", inset: 0 }}>
          <AbsoluteFill>
            <LightBackdrop abs={abs} id="g-s6b" />
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  transform: `scale(${0.92 + logoP * 0.08})`,
                  opacity: A(f, 100, 110, 0, 1),
                  padding: 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Logo width={560} maxHeight={260} />
              </div>

              <div
                style={{
                  marginTop: 40,
                  width: rule,
                  height: 4,
                  backgroundColor: C.orange,
                }}
              />

              <div
                style={{
                  marginTop: 54,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    transform: `translateY(${(1 - ctaP) * 110}%)`,
                    fontFamily: F_TEXT,
                    fontSize: 38,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: C.blue,
                    lineHeight: 1.4,
                  }}
                >
                  Confiez vos achats à OLOSTO.
                </div>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        </Reveal>
      </AbsoluteFill>
    </Reveal>
  );
};

/* =========================================================
   TIMELINE
   ========================================================= */

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Sequence from={0} durationInFrames={130}>
        <Scene1 startAt={0} />
      </Sequence>

      <Sequence from={118} durationInFrames={165}>
        <Scene2 startAt={118} />
      </Sequence>

      <Sequence from={272} durationInFrames={162}>
        <Scene3 startAt={272} />
      </Sequence>

      <Sequence from={420} durationInFrames={112}>
        <Scene4a startAt={420} />
      </Sequence>

      <Sequence from={524} durationInFrames={110}>
        <Scene4b startAt={524} />
      </Sequence>

      <Sequence from={624} durationInFrames={200}>
        <Scene4c startAt={624} />
      </Sequence>

      <Sequence from={814} durationInFrames={250}>
        <Scene5 startAt={814} />
      </Sequence>

      <Sequence from={1052} durationInFrames={178}>
        <Scene6 startAt={1052} />
      </Sequence>

      {/* vignette globale très légère */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,20,34,0.16) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <>
    <Composition
      id="MainVideo"
      component={MainVideo}
      durationInFrames={DUR}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);

registerRoot(Root);
