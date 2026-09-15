import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  registerRoot,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const services = [
  { title: "DÉVELOPPEMENT", subtitle: "Des produits numériques qui font avancer votre activité.", color: "#47D7AC", icon: "</>" },
  { title: "AUTOMATISATION", subtitle: "Moins de tâches répétitives. Plus de temps pour l’essentiel.", color: "#7F8CFF", icon: "↗" },
  { title: "MARKETING DIGITAL", subtitle: "La bonne stratégie pour toucher les bons clients.", color: "#FFB45E", icon: "◉" },
  { title: "MAINTENANCE", subtitle: "Des outils fiables, performants et toujours opérationnels.", color: "#54C5F8", icon: "✓" },
  { title: "SÉCURITÉ", subtitle: "Vos données et vos systèmes protégés au quotidien.", color: "#F37689", icon: "⌾" },
  { title: "CLOUD", subtitle: "Une infrastructure souple, accessible et prête à évoluer.", color: "#9D7CFF", icon: "☁" },
];

const Fade = ({ children, start, duration = 90 }: { children: React.ReactNode; start: number; duration?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 16, start + duration - 16, start + duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [start, start + 16], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateY(${y}px)`, width: "100%", height: "100%" }}>{children}</div>;
};

const Grid = () => {
  const frame = useCurrentFrame();
  const x = (frame * 0.35) % 80;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: 0.22, backgroundImage: "linear-gradient(#2a3b66 1px, transparent 1px), linear-gradient(90deg, #2a3b66 1px, transparent 1px)", backgroundSize: "80px 80px", backgroundPosition: `${x}px ${x}px` }} />
  );
};

const Brand = () => (
  <div style={{ position: "absolute", top: 62, left: 78, color: "#EAF1FF", fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>
    <span style={{ color: "#47D7AC" }}>NEX</span>US DIGITAL
  </div>
);

const Problem = () => {
  const frame = useCurrentFrame();
  const issues = ["Processus trop lents", "Outils dispersés", "Risques numériques"];
  return (
    <Fade start={0} duration={120}>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 110px" }}>
        <div style={{ color: "#47D7AC", fontSize: 23, fontWeight: 700, letterSpacing: 4, marginBottom: 25 }}>VOTRE ENTREPRISE MÉRITE MIEUX</div>
        <div style={{ color: "white", fontSize: 69, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>Les défis IT freinent-ils votre croissance ?</div>
        <div style={{ display: "flex", gap: 18, marginTop: 54 }}>
          {issues.map((issue, i) => {
            const p = spring({ frame: frame - 15 - i * 9, fps: 30, config: { damping: 14 } });
            return <div key={issue} style={{ transform: `scale(${p})`, border: "1px solid #3E537E", background: "#172446", color: "#DCE7FF", borderRadius: 14, padding: "17px 21px", fontSize: 23 }}>{issue}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const ServiceScene = ({ service, index }: { service: typeof services[number]; index: number }) => {
  const start = 120 + index * 105;
  const frame = useCurrentFrame();
  const local = frame - start;
  const ring = interpolate(local, [0, 88], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade start={start} duration={105}>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 110px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 55 }}>
          <div style={{ width: 198, height: 198, borderRadius: 99, background: `conic-gradient(${service.color} ${ring}deg, #172446 ${ring}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 55px ${service.color}55` }}>
            <div style={{ width: 174, height: 174, borderRadius: 87, background: "#101B36", display: "flex", alignItems: "center", justifyContent: "center", color: service.color, fontSize: 60, fontWeight: 800 }}>{service.icon}</div>
          </div>
          <div>
            <div style={{ color: service.color, fontWeight: 700, fontSize: 22, letterSpacing: 4, marginBottom: 16 }}>NOS EXPERTISES</div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 70, lineHeight: 1 }}>{service.title}</div>
            <div style={{ color: "#C9D6EE", fontSize: 29, maxWidth: 750, lineHeight: 1.35, marginTop: 25 }}>{service.subtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, position: "absolute", bottom: 75, left: 110 }}>
          {services.map((s, i) => <div key={s.title} style={{ height: 6, width: i === index ? 68 : 25, borderRadius: 5, background: i === index ? service.color : "#3D4D70", transition: "all 0.2s" }} />)}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const Closing = () => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - 750, fps: 30, config: { damping: 16 } });
  return (
    <Fade start={750} duration={150}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
        <div style={{ transform: `scale(${scale})`, width: 116, height: 116, borderRadius: 58, background: "#47D7AC", color: "#101B36", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 900 }}>↗</div>
        <div style={{ color: "#47D7AC", fontWeight: 700, fontSize: 22, letterSpacing: 5, marginTop: 34 }}>LA TECHNOLOGIE AU SERVICE DE VOTRE AMBITION</div>
        <div style={{ color: "white", fontWeight: 800, fontSize: 67, lineHeight: 1.08, marginTop: 19 }}>Concentrez-vous sur<br />votre croissance.</div>
        <div style={{ marginTop: 38, borderRadius: 10, background: "#47D7AC", color: "#101B36", fontSize: 24, fontWeight: 800, padding: "17px 31px" }}>PARLONS DE VOTRE PROJET</div>
      </AbsoluteFill>
    </Fade>
  );
};

export const MainVideo = () => (
  <AbsoluteFill style={{ backgroundColor: "#0B1328", fontFamily: "Arial, Helvetica, sans-serif" }}>
    <Grid />
    <Brand />
    <Problem />
    {services.map((service, index) => <ServiceScene key={service.title} service={service} index={index} />)}
    <Closing />
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition id="MainVideo" component={MainVideo} durationInFrames={900} fps={30} width={1920} height={1080} />
);

registerRoot(RemotionRoot);
