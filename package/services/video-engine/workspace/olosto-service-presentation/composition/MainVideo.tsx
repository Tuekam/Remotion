import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  registerRoot,
  Easing,
} from "remotion";

const NAVY = "#004369";
const ORANGE = "#DA6220";
const WHITE = "#FFFFFF";
const SOFT = "#F5F8FA";
const INK = "#163444";
const MUTED = "#6D7E87";

const FPS = 30;
const DURATION = Math.round(31817 / 1000 * FPS);

// Timing source: get_voice_over verified durationMs=31817 and word-level segments.
// Scene boundaries below are derived from the returned word timestamps, not estimated.
// The voice alignment field is null, so verified word timestamps are used for scene timing.

const SCENES = [
  { from: 0, to: 220, kicker: "VOTRE PRODUIT EST LÀ", title: "Acheter en Europe\ndepuis le Cameroun ?", kind: "hook" },
  { from: 220, to: 390, kicker: "LE FREIN", title: "L’achat peut vite\ndevennir plus compliqué.", kind: "problem" },
  { from: 390, to: 536, kicker: "ÉTAPE 01", title: "Choisissez votre produit\nsur votre site européen.", kind: "choose" },
  { from: 536, to: 675, kicker: "ÉTAPE 02", title: "OLOSTO facilite\nvotre achat.", kind: "purchase" },
  { from: 675, to: 760, kicker: "ÉTAPE 03", title: "Votre commande est\nacheminée au Cameroun.", kind: "route" },
  { from: 760, to: 876, kicker: "SIMPLE. FLUIDE. INTERNATIONAL.", title: "Du panier à l’acheminement,\nOLOSTO simplifie.", kind: "value" },
  { from: 876, to: 955, kicker: "OLOSTO", title: "Vos achats européens,\nplus simples.", kind: "cta" },
];

const fontFaces = `
@font-face{font-family:Nunito;src:url('${staticFile("fonts/Nunito/Nunito-Regular.ttf")}') format('truetype');font-weight:400}
@font-face{font-family:Nunito;src:url('${staticFile("fonts/Nunito/Nunito-Bold.ttf")}') format('truetype');font-weight:700}
@font-face{font-family:Luckybones;src:url('${staticFile("fonts/Luckybones/Luckybones-Bold.otf")}') format('opentype');font-weight:700}
`;

function LogoMark({compact=false}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:compact?42:56,height:compact?42:56,borderRadius:"50%",border:`7px solid ${NAVY}`,boxShadow:`0 0 0 5px ${ORANGE}`,display:"flex",alignItems:"center",justifyContent:"center",background:WHITE}}>
        <div style={{width:"52%",height:5,borderRadius:10,background:NAVY,transform:"rotate(-10deg)"}}/>
      </div>
      <div style={{fontFamily:"Luckybones",fontSize:compact?43:60,color:NAVY,lineHeight:.8,letterSpacing:-1}}>olosto</div>
    </div>
  );
}

function GridBackground() {
  return <AbsoluteFill style={{background:`radial-gradient(circle at 75% 12%, rgba(218,98,32,.13), transparent 24%), linear-gradient(145deg,#fff 0%,#f4f8fa 100%)`}}>
    <div style={{position:"absolute",inset:0,opacity:.32,backgroundImage:`linear-gradient(rgba(0,67,105,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,67,105,.07) 1px,transparent 1px)`,backgroundSize:"54px 54px"}}/>
  </AbsoluteFill>;
}

function Header() {
  const f=useCurrentFrame();
  const x=interpolate(f,[0,18],[30,0],{extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
  return <div style={{position:"absolute",top:62,left:70,right:70,display:"flex",justifyContent:"space-between",alignItems:"center",transform:`translateY(${x}px)`,opacity:interpolate(f,[0,18],[0,1],{extrapolateRight:"clamp"})}}>
    <LogoMark compact/>
    <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:22,color:NAVY,letterSpacing:2}}>ACHATS INTERNATIONAUX</div>
  </div>;
}

function Kicker({children}) {
  return <div style={{display:"inline-flex",alignItems:"center",gap:12,padding:"10px 18px",borderRadius:30,background:NAVY,color:WHITE,fontFamily:"Nunito",fontWeight:700,fontSize:20,letterSpacing:1.2}}>
    <span style={{width:8,height:8,borderRadius:"50%",background:ORANGE}}/>{children}
  </div>;
}

function TextBlock({kicker,title,accent=false}) {
  const f=useCurrentFrame();
  const y=interpolate(f,[0,20],[70,0],{extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
  return <div style={{transform:`translateY(${y}px)`,opacity:interpolate(f,[0,18],[0,1],{extrapolateRight:"clamp"})}}>
    <Kicker>{kicker}</Kicker>
    <div style={{marginTop:28,fontFamily:"Luckybones",fontWeight:700,fontSize:72,lineHeight:.98,letterSpacing:-1.5,color:NAVY,whiteSpace:"pre-line"}}>
      {title.split("\n").map((t,i)=><div key={i}>{accent && i===1?<><span>{t.split(" ")[0]} </span><span style={{color:ORANGE}}>{t.split(" ").slice(1).join(" ")}</span></>:t}</div>)}
    </div>
  </div>;
}

function PhoneCard({kind}) {
  const f=useCurrentFrame();
  const s=spring({frame:f,fps:FPS,config:{damping:15,stiffness:120}});
  const rotate=interpolate(f,[0,35],[7,0],{extrapolateRight:"clamp"});
  return <div style={{width:430,height:760,borderRadius:48,background:"#101A20",padding:14,boxShadow:"0 30px 80px rgba(0,67,105,.25)",transform:`translateY(${(1-s)*120}px) rotate(${rotate}deg)`,opacity:interpolate(f,[0,12],[0,1],{extrapolateRight:"clamp"})}}>
    <div style={{height:"100%",borderRadius:38,background:WHITE,overflow:"hidden",position:"relative"}}>
      <div style={{height:90,background:NAVY,color:WHITE,padding:"25px 28px",fontFamily:"Nunito",fontWeight:700,fontSize:24,display:"flex",justifyContent:"space-between"}}><span>SHOP</span><span>•••</span></div>
      <div style={{padding:28}}>
        <div style={{height:230,borderRadius:24,background:"linear-gradient(135deg,#edf3f5,#fff)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:170,height:170,borderRadius:30,background:kind==="choose"?ORANGE:NAVY,transform:"rotate(-8deg)",boxShadow:"0 18px 35px rgba(0,67,105,.16)"}}/>
        </div>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:26,color:INK,marginTop:24}}>Votre sélection</div>
        <div style={{fontFamily:"Nunito",fontSize:18,color:MUTED,marginTop:7}}>Produit européen · Livraison</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:28}}>
          <span style={{fontFamily:"Luckybones",fontSize:38,color:NAVY}}>€ 129</span>
          <div style={{background:ORANGE,color:WHITE,borderRadius:18,padding:"15px 20px",fontFamily:"Nunito",fontWeight:700}}>AJOUTER</div>
        </div>
      </div>
    </div>
  </div>;
}

function RouteVisual() {
  const f=useCurrentFrame();
  const p=interpolate(f,[0,65],[0,1],{extrapolateRight:"clamp"});
  return <div style={{width:700,height:420,position:"relative"}}>
    <div style={{position:"absolute",top:190,left:65,right:65,height:4,background:"#DCE7EC"}}/>
    <div style={{position:"absolute",top:184,left:65,width:570*p,height:16,borderRadius:10,background:ORANGE}}/>
    {[{x:65,label:"EUROPE",n:"EU"},{x:635,label:"CAMEROUN",n:"CM"}].map((d,i)=><div key={i} style={{position:"absolute",left:d.x-48,top:145,textAlign:"center"}}>
      <div style={{width:96,height:96,borderRadius:"50%",background:i===0?NAVY:ORANGE,color:WHITE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Nunito",fontWeight:700,fontSize:25,boxShadow:"0 16px 35px rgba(0,67,105,.18)"}}>{d.n}</div>
      <div style={{marginTop:16,fontFamily:"Nunito",fontWeight:700,color:NAVY,fontSize:19}}>{d.label}</div>
    </div>)}
    <div style={{position:"absolute",left:80+510*p,top:120,transform:"translateX(-50%)",opacity:p}}>
      <div style={{width:72,height:52,borderRadius:14,background:WHITE,border:`3px solid ${NAVY}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 10px 25px rgba(0,67,105,.15)"}}>▰</div>
    </div>
    <div style={{position:"absolute",top:245,left:0,right:0,textAlign:"center",fontFamily:"Nunito",fontWeight:700,fontSize:22,color:INK}}>Votre commande avance. OLOSTO prend le relais.</div>
  </div>;
}

function Scene({scene}) {
  return <AbsoluteFill>
    <GridBackground/>
    <Header/>
    <div style={{position:"absolute",left:80,right:80,top:260,bottom:120,display:"flex",alignItems:"center",justifyContent:"space-between",gap:55}}>
      <div style={{width:scene.kind==="route"?1000:scene.kind==="cta"?720:760}}>
        <TextBlock kicker={scene.kicker} title={scene.title} accent={scene.kind==="value"||scene.kind==="cta"}/>
        {scene.kind==="cta" && <div style={{marginTop:34,fontFamily:"Nunito",fontWeight:700,fontSize:28,color:WHITE,background:ORANGE,display:"inline-block",padding:"20px 30px",borderRadius:18}}>Confiez vos achats à OLOSTO →</div>}
      </div>
      {scene.kind==="hook" && <PhoneCard kind="choose"/>}
      {scene.kind==="choose" && <PhoneCard kind="choose"/>}
      {scene.kind==="purchase" && <div style={{width:520,height:520,borderRadius:44,background:NAVY,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 35px 80px rgba(0,67,105,.24)"}}><div style={{textAlign:"center",color:WHITE}}><div style={{fontFamily:"Luckybones",fontSize:90}}>OLOSTO</div><div style={{fontFamily:"Nunito",fontWeight:700,fontSize:25,marginTop:16}}>ACHAT FACILITÉ</div><div style={{width:120,height:7,background:ORANGE,borderRadius:10,margin:"28px auto"}}/><div style={{fontFamily:"Nunito",fontSize:20,opacity:.85}}>Vous choisissez.<br/>Nous facilitons.</div></div></div>}
      {scene.kind==="route" && <RouteVisual/>}
      {scene.kind==="value" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,width:500}}>
        {["Choisir","Acheter","Acheminer","Recevoir"].map((x,i)=><div key={x} style={{background:WHITE,borderRadius:22,padding:24,border:"1px solid #DDE8ED",boxShadow:"0 10px 28px rgba(0,67,105,.08)"}}><div style={{fontFamily:"Luckybones",fontSize:42,color:ORANGE}}>0{i+1}</div><div style={{fontFamily:"Nunito",fontWeight:700,fontSize:23,color:NAVY,marginTop:7}}>{x}</div></div>)}
      </div>}
    </div>
    <div style={{position:"absolute",bottom:42,left:80,right:80,height:5,borderRadius:10,background:"#DCE7EC"}}><div style={{height:"100%",width:`${Math.min(100,((scene.to)/(DURATION))*100)}%`,background:ORANGE,borderRadius:10}}/></div>
  </AbsoluteFill>;
}

function MainVideo() {
  const f=useCurrentFrame();
  const scene=SCENES.find(s=>f>=s.from&&f<s.to)||SCENES[SCENES.length-1];
  const local=f-scene.from;
  return <AbsoluteFill style={{fontFamily:"Nunito"}}>
    <style>{fontFaces}</style>
    <Sequence from={scene.from} durationInFrames={scene.to-scene.from}>
      <Scene scene={scene}/>
    </Sequence>
    <Audio src={staticFile("audio/voice-over.mp3")} volume={1}/>
  </AbsoluteFill>;
}

export const RemotionRoot = () => <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920}/>;

registerRoot(RemotionRoot);
