import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  registerRoot,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const navy = "#07172b";
const blue = "#1696ff";
const cyan = "#42e8ff";
const white = "#f7fbff";

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.32,
      backgroundImage:
        "linear-gradient(rgba(66,232,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(66,232,255,.14) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />
);

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 12, padding: "15px 25px",
    borderRadius: 999, border: "1px solid rgba(66,232,255,.4)",
    background: "rgba(9,39,76,.72)", color: cyan, fontSize: 24, fontWeight: 700,
    letterSpacing: 1.5,
  }}>
    <span style={{width: 10, height: 10, background: cyan, borderRadius: 10, boxShadow: "0 0 18px #42e8ff"}} />
    {children}
  </div>
);

const Server: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + Math.sin((frame - delay) / 7) * 0.35;
  return <div style={{
    position: "absolute", left: x, top: y, width: 400, height: 142, borderRadius: 16,
    background: "linear-gradient(105deg,#123b66,#0b2344)", border: "2px solid rgba(66,232,255,.55)",
    boxShadow: "0 16px 42px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.15)",
  }}>
    {[0,1,2,3,4,5].map((n) => <div key={n} style={{
      position:"absolute", left: 35 + n * 48, top: 54, width: 18, height: 18, borderRadius: 20,
      background: n < 4 ? cyan : blue, opacity: n < 4 ? pulse : .75,
      boxShadow: n < 4 ? "0 0 15px #42e8ff" : "none",
    }} />)}
    <div style={{position:"absolute", right:28, top:30, height:76, width:7, borderRadius:8, background:"#315779"}} />
  </div>;
};

const Scene: React.FC<{start: number; end: number; children: React.ReactNode}> = ({start, end, children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fade(frame, start, end)}}>{children}</AbsoluteFill>;
};

const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame, fps, config: {damping: 120}});
  const drift = Math.sin(frame / 35) * 14;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 15%, #174d88 0%, ${navy} 42%, #030914 100%)`,
      fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden",
    }}>
      <Grid />
      <div style={{position:"absolute", width:900, height:900, borderRadius:999, border:"1px solid rgba(66,232,255,.18)", left:90, top:570, transform:`rotate(${frame / 9}deg)`}} />
      <div style={{position:"absolute", width:600, height:600, borderRadius:999, border:"1px solid rgba(22,150,255,.2)", left:240, top:720, transform:`rotate(-${frame / 7}deg)`}} />

      <Scene start={0} end={170}>
        <div style={{position:"absolute", top:210, left:85, right:85, transform:`translateY(${(1-rise)*45}px)`, textAlign:"center"}}>
          <Pill>EXPERTISE INFORMATIQUE</Pill>
          <h1 style={{color:white, fontSize:94, lineHeight:1.04, letterSpacing:-3, margin:"55px 0 25px", fontWeight:800}}>Votre technologie.<br/><span style={{color:cyan}}>Notre maîtrise.</span></h1>
          <p style={{color:"#b8d7ef", fontSize:34, lineHeight:1.45, margin:0}}>Des services fiables pour accélérer votre entreprise.</p>
        </div>
        <div style={{position:"absolute", top:1050, left:90, right:90, height:350, borderRadius:36, background:"linear-gradient(135deg,rgba(22,150,255,.31),rgba(66,232,255,.05))", border:"1px solid rgba(66,232,255,.35)", transform:`translateY(${drift}px)`}}>
          <div style={{fontSize:180, color:cyan, textAlign:"center", paddingTop:65, letterSpacing:22}}>01 01 01</div>
        </div>
      </Scene>

      <Scene start={145} end={355}>
        <div style={{position:"absolute", top:210, left:80, right:80}}>
          <Pill>INFRASTRUCTURES</Pill>
          <h2 style={{color:white, fontSize:78, lineHeight:1.08, margin:"42px 0 0", letterSpacing:-2}}>Des serveurs<br/>toujours <span style={{color:cyan}}>disponibles.</span></h2>
        </div>
        <div style={{position:"absolute", top:750, left:0, right:0}}>
          <Server x={-35} y={0} delay={160}/><Server x={90} y={180} delay={178}/><Server x={-35} y={360} delay={196}/>
        </div>
        <div style={{position:"absolute", bottom:205, left:85, right:85, padding:30, borderLeft:"4px solid #42e8ff", color:"#c7e2f5", fontSize:31, lineHeight:1.4, background:"rgba(3,13,27,.5)"}}>Sécurité · Maintenance · Performance</div>
      </Scene>

      <Scene start={330} end={540}>
        <div style={{position:"absolute", top:195, left:80, right:80}}>
          <Pill>DÉVELOPPEMENT</Pill>
          <h2 style={{color:white, fontSize:76, lineHeight:1.08, margin:"42px 0 0"}}>Du code clair.<br/><span style={{color:cyan}}>Des solutions solides.</span></h2>
        </div>
        <div style={{position:"absolute", top:650, left:65, right:65, padding:45, borderRadius:28, background:"#081b35", border:"1px solid #246da2", boxShadow:"0 24px 70px rgba(0,0,0,.45)", fontFamily:"Consolas, monospace", color:"#8edfff", fontSize:28, lineHeight:1.75}}>
          <div style={{color:"#5c92ba"}}>{"// performance & innovation"}</div>
          <div><span style={{color:"#cc8bff"}}>const</span> solution = <span style={{color:"#8cffbf"}}>"sur mesure"</span>;</div>
          <div><span style={{color:"#cc8bff"}}>await</span> <span style={{color:cyan}}>deploy</span>(solution);</div>
          <div style={{color:"#5c92ba"}}>{"// succès connecté"}</div>
          <div style={{width:interpolate(frame % 50,[0,25,50],[30,330,30]), height:4, background:cyan, marginTop:20}}/>
        </div>
      </Scene>

      <Scene start={515} end={735}>
        <div style={{position:"absolute", top:190, left:80, right:80}}>
          <Pill>SUPPORT À DISTANCE</Pill>
          <h2 style={{color:white, fontSize:72, lineHeight:1.08, margin:"42px 0 0"}}>Une équipe<br/><span style={{color:cyan}}>à vos côtés.</span></h2>
        </div>
        <div style={{position:"absolute", top:725, left:155, width:770, height:430, borderRadius:35, background:"linear-gradient(135deg,#174c80,#092141)", border:"2px solid rgba(66,232,255,.6)", boxShadow:"0 0 55px rgba(66,232,255,.18)"}}>
          <div style={{position:"absolute", left:60, top:58, width:110, height:110, borderRadius:100, background:"#42e8ff", opacity:.9}} />
          <div style={{position:"absolute", left:55, top:180, width:125, height:145, borderRadius:"70px 70px 24px 24px", background:"#42e8ff", opacity:.9}} />
          <div style={{position:"absolute", left:255, top:80, right:45, color:white, fontSize:34, fontWeight:700}}>Assistance immédiate</div>
          <div style={{position:"absolute", left:255, top:145, right:45, color:"#b8d7ef", fontSize:25, lineHeight:1.45}}>Diagnostic, intervention et suivi en temps réel.</div>
          <div style={{position:"absolute", left:255, bottom:58, width:310, height:13, background:"#42e8ff", borderRadius:9, boxShadow:"0 0 18px #42e8ff"}} />
        </div>
      </Scene>

      <Scene start={710} end={900}>
        <div style={{position:"absolute", top:190, left:75, right:75, textAlign:"center"}}>
          <Pill>ENTREPRISES CONNECTÉES</Pill>
          <h2 style={{color:white, fontSize:72, lineHeight:1.08, margin:"43px 0 0"}}>Faites grandir<br/><span style={{color:cyan}}>votre activité.</span></h2>
        </div>
        {[{x:170,y:820},{x:730,y:870},{x:420,y:1170},{x:130,y:1370},{x:780,y:1420}].map((p,i)=><div key={i} style={{position:"absolute",left:p.x,top:p.y,width:145,height:105,borderRadius:20,background:"linear-gradient(135deg,#268ccc,#123d70)",border:"1px solid #6beeff",boxShadow:"0 0 28px rgba(66,232,255,.32)"}} />)}
        <div style={{position:"absolute",left:460,top:1030,width:160,height:160,borderRadius:160,background:cyan,boxShadow:"0 0 55px #42e8ff",display:"flex",alignItems:"center",justifyContent:"center",color:navy,fontWeight:900,fontSize:45}}>IT</div>
        <div style={{position:"absolute",bottom:100,left:75,right:75,padding:"28px 20px",textAlign:"center",color:navy,fontSize:35,fontWeight:800,borderRadius:20,background:cyan}}>PARLONS DE VOTRE PROJET</div>
      </Scene>

      <div style={{position:"absolute", top:62, left:75, color:white, fontWeight:800, letterSpacing:3, fontSize:25}}>VOTRE AGENCE IT</div>
      <div style={{position:"absolute", top:70, right:75, width:110, height:5, background:cyan}} />
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <Composition id="MainVideo" component={MainVideo} durationInFrames={900} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
