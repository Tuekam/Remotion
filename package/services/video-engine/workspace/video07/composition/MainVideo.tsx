import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  registerRoot,
} from "remotion";

const BLUE = "#004369";
const ORANGE = "#DA6220";
const CREAM = "#F7F4EC";
const WHITE = "#FFFDF8";
const INK = "#171717";
const MUTED = "#77736C";
const SOFT = "#ECE7DB";
const LINE = "#DED8CC";

const TIMINGS = {
  hook: [0, 231],
  problem: [231, 318],
  olosto: [318, 498],
  action: [498, 603],
  fluid: [603, 891],
  final: [891, 1050],
};
// Timing source: verified ElevenLabs word timestamps for video07, duration 34.978s at 30fps.

const ease = (f:number, delay=0, stiffness=180) => {
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 18, stiffness, mass: 0.62 } });
};

const clamp = (f:number, a:number, b:number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

function Logo({ dark=false }: { dark?: boolean }) {
  return (
    <Img
      src={staticFile("assets/logo.jpeg")}
      style={{
        position: "absolute",
        top: 48,
        left: 52,
        width: 104,
        height: 104,
        objectFit: "contain",
        opacity: dark ? 0.96 : 1,
      }}
    />
  );
}

function Word({ children, color=ORANGE }: { children:React.ReactNode; color?:string }) {
  return <span style={{ color }}>{children}</span>;
}

function Kicker({ children, top=154, color=MUTED }: { children:React.ReactNode; top?:number; color?:string }) {
  const f = useCurrentFrame();
  const p = ease(f, 2);
  return (
    <div style={{
      position:"absolute", top, left:64, right:64, fontFamily:"Nunito",
      fontSize:16, fontWeight:900, letterSpacing:3.2, color, opacity:p,
      transform:"translateY(" + ((1-p)*18) + "px)"
    }}>{children}</div>
  );
}

function Curtain({ at, color=BLUE }: { at:number; color?:string }) {
  const f = useCurrentFrame();
  const local = f - at;
  if (local < 0 || local > 22) return null;
  const p = clamp(local, 0, 18);
  const leftX = interpolate(p, [0, 1], [0, -100], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const rightX = interpolate(p, [0, 1], [0, 100], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  return (
    <AbsoluteFill style={{ zIndex:50, pointerEvents:"none" }}>
      <div style={{
        position:"absolute", top:0, bottom:0, left:0, width:"51%",
        background:color, transform:"translateX(" + (leftX*(1-p) + (-1080*p)) + "px)"
      }}/>
      <div style={{
        position:"absolute", top:0, bottom:0, right:0, width:"51%",
        background:color, transform:"translateX(" + (-rightX*(1-p) + (1080*p)) + "px)"
      }}/>
      <div style={{
        position:"absolute", top:0, bottom:0, left:"50%", width:4,
        background:ORANGE, transform:"translateX(-50%) scaleY(" + (1-p) + ")"
      }}/>
    </AbsoluteFill>
  );
}

function ProductVisual({ scale=1, accent=true }: { scale?:number; accent?:boolean }) {
  return (
    <div style={{
      width:260*scale, height:260*scale, borderRadius:38*scale,
      background:"#EEF0ED", position:"relative", overflow:"hidden",
      boxShadow:"0 24px 50px rgba(39,31,18,.12)"
    }}>
      <div style={{
        position:"absolute", left:34*scale, top:30*scale, width:190*scale, height:198*scale,
        borderRadius:28*scale, background:WHITE,
        transform:"rotate(-6deg)", boxShadow:"0 18px 32px rgba(0,0,0,.12)"
      }}>
        <div style={{position:"absolute",left:24*scale,top:22*scale,right:24*scale,height:13*scale,borderRadius:7*scale,background:BLUE}}/>
        <div style={{position:"absolute",left:24*scale,top:56*scale,width:104*scale,height:9*scale,borderRadius:5*scale,background:"#D9DEE0"}}/>
        <div style={{position:"absolute",left:24*scale,top:81*scale,width:132*scale,height:9*scale,borderRadius:5*scale,background:"#D9DEE0"}}/>
        <div style={{position:"absolute",left:24*scale,bottom:25*scale,width:78*scale,height:30*scale,borderRadius:10*scale,background:accent?ORANGE:BLUE}}/>
      </div>
    </div>
  );
}

function Parcel({ small=false }: { small?:boolean }) {
  const w = small ? 108 : 142;
  const h = small ? 86 : 112;
  return (
    <div style={{
      width:w, height:h, borderRadius:16, background:"#C9B08D",
      boxShadow:"0 18px 35px rgba(40,25,8,.16)", position:"relative"
    }}>
      <div style={{position:"absolute",left:0,right:0,top:h*.47,height:4,background:"#B2946A"}}/>
      <div style={{position:"absolute",left:w*.4,top:0,width:w*.2,height:h,background:"#DCC49F",opacity:.78}}/>
    </div>
  );
}

function BrowserCard({ x=70, y=660, p=1 }: { x?:number; y?:number; p?:number }) {
  return (
    <div style={{
      position:"absolute", left:x, top:y, width:900, height:560, borderRadius:36,
      background:WHITE, border:"1px solid "+LINE,
      boxShadow:"0 30px 80px rgba(39,31,18,.12)",
      opacity:p, transform:"translate3d(" + ((1-p)*70) + "px," + ((1-p)*30) + "px,0) scale(" + (.95+.05*p) + ")"
    }}>
      <div style={{position:"absolute",left:0,right:0,top:0,height:54,borderBottom:"1px solid "+LINE,display:"flex",alignItems:"center",paddingLeft:24,gap:8}}>
        <span style={{width:10,height:10,borderRadius:99,background:"#D7D1C5"}}/>
        <span style={{width:10,height:10,borderRadius:99,background:"#D7D1C5"}}/>
        <span style={{width:10,height:10,borderRadius:99,background:"#D7D1C5"}}/>
        <div style={{marginLeft:18,width:420,height:28,borderRadius:14,background:"#F0ECE4"}}/>
      </div>
      <div style={{position:"absolute",left:42,top:94}}><ProductVisual scale={1.22}/></div>
      <div style={{position:"absolute",left:390,top:104,fontFamily:"Nunito"}}>
        <div style={{fontSize:17,fontWeight:900,color:MUTED,letterSpacing:2}}>EUROPEAN BOUTIQUE</div>
        <div style={{fontFamily:"Luckybones",fontSize:44,fontWeight:700,color:INK,marginTop:13}}>Votre sélection.</div>
        <div style={{marginTop:24,width:310,height:3,background:SOFT}}/>
        <div style={{marginTop:26,width:230,height:58,borderRadius:18,background:BLUE,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900}}>AJOUTER AU PANIER</div>
      </div>
    </div>
  );
}

function Hook() {
  const f = useCurrentFrame();
  const title = ease(f, 8);
  const browser = ease(f, 22);
  const cursor = ease(f, 72);
  const pulse = 0.5 + 0.5*Math.sin(f/8);
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <Logo/>
      <Kicker>EUROPE → CAMEROUN</Kicker>
      <div style={{
        position:"absolute", top:250, left:54, right:54, fontFamily:"Luckybones",
        fontSize:82, lineHeight:.9, letterSpacing:-2.8, color:INK,
        opacity:title, transform:"translate3d(" + ((1-title)*45) + "px,0,0)"
      }}>
        UN PRODUIT<br/><Word>EN EUROPE ?</Word>
      </div>
      <div style={{
        position:"absolute", right:70, top:260, width:180, height:180, borderRadius:"50%",
        border:"2px solid "+LINE, opacity:.7,
        transform:"rotate(" + (f*.7) + "deg) scale(" + (.92+.08*pulse) + ")"
      }}>
        <div style={{position:"absolute",top:-7,left:"50%",width:14,height:14,borderRadius:99,background:ORANGE}}/>
      </div>
      <BrowserCard p={browser}/>
      <div style={{
        position:"absolute", left:700, top:1130, width:170, height:62, borderRadius:20,
        background:ORANGE, color:"white", fontFamily:"Nunito", fontSize:18, fontWeight:900,
        display:"flex",alignItems:"center",justifyContent:"center",
        opacity:cursor, transform:"translateY(" + ((1-cursor)*22) + "px)"
      }}>PANIER ✓</div>
      <div style={{
        position:"absolute", left:690, top:1080, width:34, height:34, borderRadius:"50%",
        border:"3px solid "+BLUE, background:WHITE, opacity:cursor
      }}/>
      <Curtain at={223} color={ORANGE}/>
    </AbsoluteFill>
  );
}

function Problem() {
  const f = useCurrentFrame();
  const l = f - 231;
  const q1 = ease(l, 0), q2 = ease(l, 14), q3 = ease(l, 28);
  const route = clamp(l, 4, 68);
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <Logo/>
      <Kicker top={148}>UNE QUESTION SE POSE</Kicker>
      <div style={{
        position:"absolute", top:260, left:58, right:58, fontFamily:"Luckybones",
        fontSize:70, lineHeight:.92, color:INK, opacity:q1,
        transform:"translateY(" + ((1-q1)*35) + "px)"
      }}>
        COMMENT LE RECEVOIR<br/><Word>AU CAMEROUN ?</Word>
      </div>
      <div style={{
        position:"absolute",left:70,top:610,width:940,height:430,borderRadius:34,
        background:WHITE,border:"1px solid "+LINE,boxShadow:"0 24px 60px rgba(39,31,18,.09)"
      }}>
        <div style={{position:"absolute",left:54,top:54,fontFamily:"Nunito",fontWeight:900,fontSize:18,color:MUTED}}>LE PARCOURS</div>
        <div style={{position:"absolute",left:54,top:126,width:830,height:4,background:SOFT}}/>
        <div style={{position:"absolute",left:54,top:123,width:830*route,height:7,background:ORANGE,borderRadius:8}}/>
        {[
          {x:54,t:"PAIEMENT",p:q1},
          {x:300,t:"ADRESSE",p:q2},
          {x:546,t:"EXPÉDITION",p:q2},
          {x:792,t:"CAMEROUN",p:q3}
        ].map((it,i)=>(
          <div key={it.t} style={{position:"absolute",left:it.x,top:180,opacity:it.p,transform:"translateY(" + ((1-it.p)*22) + "px)"}}>
            <div style={{width:66,height:66,borderRadius:20,background:i===3?ORANGE:SOFT,color:i===3?"white":BLUE,fontFamily:"Nunito",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{"0"+(i+1)}</div>
            <div style={{marginTop:15,fontFamily:"Nunito",fontSize:17,fontWeight:900,color:INK}}>{it.t}</div>
          </div>
        ))}
        <svg style={{position:"absolute",left:54,top:245,width:830,height:140}}>
          <path d="M10 80 C160 10 250 140 390 72 S650 20 820 76" fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="10 12" opacity=".35"/>
        </svg>
      </div>
      <Curtain at={309} color={BLUE}/>
    </AbsoluteFill>
  );
}

function Olosto() {
  const f = useCurrentFrame();
  const l = f - 318;
  const wipe = clamp(l, 0, 18);
  const logo = ease(l, 16);
  const title = ease(l, 38);
  const sub = ease(l, 72);
  const line = clamp(l, 78, 104);
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <div style={{position:"absolute",inset:0,background:BLUE,transform:"translateX(" + ((1-wipe)*-100) + "%)"}}/>
      <div style={{position:"absolute",top:0,right:0,width:7,height:"100%",background:ORANGE,opacity:wipe}}/>
      <div style={{position:"absolute",top:118,left:0,right:0,textAlign:"center",fontFamily:"Nunito",fontSize:16,fontWeight:900,letterSpacing:4,color:WHITE,opacity:logo}}>LA SOLUTION</div>
      <Img src={staticFile("assets/logo.jpeg")} style={{
        position:"absolute",left:390,top:260,width:300,height:300,objectFit:"contain",
        background:WHITE,borderRadius:48,padding:20,boxShadow:"0 30px 80px rgba(0,0,0,.18)",
        opacity:logo,transform:"scale(" + (.72+.28*logo) + ") rotate(" + ((1-logo)*-7) + "deg)"
      }}/>
      <div style={{position:"absolute",top:620,left:45,right:45,textAlign:"center",fontFamily:"Luckybones",fontSize:65,lineHeight:.92,color:INK,opacity:title,transform:"translateY(" + ((1-title)*28) + "px)"}}>
        VOTRE ACHAT<br/><Word>DEVIENT PLUS SIMPLE.</Word>
      </div>
      <div style={{position:"absolute",top:835,left:110,right:110,height:5,background:LINE,transform:"scaleX(" + line + ")",transformOrigin:"left center"}}/>
      <div style={{position:"absolute",top:875,left:0,right:0,textAlign:"center",fontFamily:"Nunito",fontSize:22,fontWeight:800,color:MUTED,opacity:sub}}>OLOSTO, votre facilitateur d’achat.</div>
      <Curtain at={486} color={ORANGE}/>
    </AbsoluteFill>
  );
}

function Action() {
  const f = useCurrentFrame();
  const l = f - 498;
  const p1 = ease(l, 0);
  const p2 = ease(l, 22);
  const p3 = ease(l, 44);
  const move = clamp(l, 50, 100);
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <Logo/>
      <Kicker>UN PARCOURS SIMPLE</Kicker>
      <div style={{position:"absolute",top:255,left:0,right:0,textAlign:"center",fontFamily:"Luckybones",fontSize:78,color:INK}}>
        VOUS <Word>COMMANDEZ.</Word>
      </div>
      <div style={{position:"absolute",left:80,top:510,width:920,height:300,borderRadius:34,background:WHITE,border:"1px solid "+LINE,boxShadow:"0 24px 60px rgba(39,31,18,.09)",opacity:p1,transform:"translateX(" + ((1-p1)*-90) + "px)"}}>
        <div style={{position:"absolute",left:42,top:42}}><ProductVisual scale={.82}/></div>
        <div style={{position:"absolute",left:270,top:62,fontFamily:"Nunito"}}>
          <div style={{fontSize:16,fontWeight:900,letterSpacing:2,color:ORANGE}}>ÉTAPE 01</div>
          <div style={{fontFamily:"Luckybones",fontSize:40,color:INK,marginTop:8}}>VOUS CHOISISSEZ</div>
          <div style={{fontSize:18,color:MUTED,marginTop:10}}>Votre produit en Europe.</div>
        </div>
      </div>
      <div style={{position:"absolute",left:80,top:860,width:920,height:300,borderRadius:34,background:BLUE,boxShadow:"0 24px 60px rgba(0,67,105,.18)",opacity:p2,transform:"translateX(" + ((1-p2)*90) + "px)"}}>
        <div style={{position:"absolute",left:48,top:52,fontFamily:"Nunito",fontSize:16,fontWeight:900,letterSpacing:2,color:"#CFE0E8"}}>ÉTAPE 02</div>
        <div style={{position:"absolute",left:48,top:90,fontFamily:"Luckybones",fontSize:43,color:WHITE}}>OLOSTO PREND LE RELAIS.</div>
        <div style={{position:"absolute",right:72,top:66,opacity:p2,transform:"rotate(" + ((1-p2)*-8) + "deg) scale(" + (.8+.2*p2) + ")"}}><Parcel small/></div>
      </div>
      <div style={{position:"absolute",top:1220,left:0,right:0,textAlign:"center",fontFamily:"Nunito",fontSize:21,fontWeight:900,color:ORANGE,opacity:p3,transform:"translateY(" + ((1-p3)*24) + "px)"}}>NOUS FACILITONS VOTRE ACHAT.</div>
      <Curtain at={590} color={BLUE}/>
    </AbsoluteFill>
  );
}

function Fluid() {
  const f = useCurrentFrame();
  const l = f - 603;
  const travel = clamp(l, 0, 160);
  const receive = ease(l, 165);
  const statement = ease(l, 235);
  const detail = ease(l, 285);
  const x = 120 + 760*travel;
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <Logo/>
      <Kicker>DE L’EUROPE AU CAMEROUN</Kicker>
      <div style={{position:"absolute",top:250,left:0,right:0,textAlign:"center",fontFamily:"Luckybones",fontSize:76,lineHeight:.92,color:INK,opacity:ease(l,0)}}>
        NOUS <Word>ACHEMINONS.</Word>
      </div>
      <div style={{position:"absolute",left:110,top:520,width:860,height:6,background:SOFT}}/>
      <div style={{position:"absolute",left:110,top:517,width:860*travel,height:8,background:ORANGE,borderRadius:8}}/>
      <div style={{position:"absolute",left:82,top:490,width:64,height:64,borderRadius:"50%",background:BLUE}}/>
      <div style={{position:"absolute",left:934,top:490,width:64,height:64,borderRadius:"50%",background:ORANGE}}/>
      <div style={{position:"absolute",left:x,top:450,transform:"rotate(" + ((1-travel)*-6) + "deg)"}}><Parcel/></div>
      <div style={{position:"absolute",left:76,top:590,fontFamily:"Nunito",fontSize:18,fontWeight:900,color:BLUE}}>EUROPE</div>
      <div style={{position:"absolute",right:65,top:590,fontFamily:"Nunito",fontSize:18,fontWeight:900,color:BLUE}}>CAMEROUN</div>
      <div style={{position:"absolute",top:760,left:0,right:0,textAlign:"center",fontFamily:"Luckybones",fontSize:82,color:INK,opacity:receive,transform:"translateY(" + ((1-receive)*30) + "px)"}}>
        VOUS <Word>RECEVEZ.</Word>
      </div>
      <div style={{position:"absolute",top:1040,left:80,right:80,height:4,background:LINE}}/>
      <div style={{position:"absolute",top:1100,left:55,right:55,textAlign:"center",fontFamily:"Luckybones",fontSize:57,lineHeight:.95,color:INK,opacity:statement,transform:"translateY(" + ((1-statement)*28) + "px)"}}>
        UNE EXPÉRIENCE <Word>FLUIDE.</Word>
      </div>
      <div style={{position:"absolute",top:1265,left:95,right:95,textAlign:"center",fontFamily:"Nunito",fontSize:20,lineHeight:1.35,color:MUTED,opacity:detail}}>
        Pensée pour vous permettre d’accéder plus facilement à vos achats européens,
        sans vous perdre dans les contraintes logistiques.
      </div>
      <Curtain at={878} color={ORANGE}/>
    </AbsoluteFill>
  );
}

function Final() {
  const f = useCurrentFrame();
  const l = f - 891;
  const p = ease(l, 0);
  const title = ease(l, 26);
  const cta = ease(l, 58);
  return (
    <AbsoluteFill style={{background:CREAM}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,"+CREAM+" 0%,#F1EDE2 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:14,background:ORANGE}}/>
      <Img src={staticFile("assets/logo.jpeg")} style={{
        position:"absolute",left:415,top:230,width:250,height:250,objectFit:"contain",
        opacity:p,transform:"scale(" + (.76+.24*p) + ")"
      }}/>
      <div style={{position:"absolute",top:565,left:0,right:0,textAlign:"center",fontFamily:"Luckybones",fontSize:76,lineHeight:.92,color:INK,opacity:title}}>
        VOS ACHATS<br/><Word>EUROPÉENS.</Word>
      </div>
      <div style={{position:"absolute",top:820,left:0,right:0,textAlign:"center",fontFamily:"Luckybones",fontSize:82,color:INK,opacity:cta,transform:"translateY(" + ((1-cta)*30) + "px)"}}>
        PLUS <Word>SIMPLES.</Word>
      </div>
      <div style={{position:"absolute",left:120,right:120,bottom:250,height:88,borderRadius:26,background:BLUE,color:WHITE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Nunito",fontSize:24,fontWeight:900,opacity:cta,transform:"translateY(" + ((1-cta)*32) + "px)"}}>
        Confiez vos commandes à OLOSTO.
      </div>
      <div style={{position:"absolute",bottom:132,left:0,right:0,textAlign:"center",fontFamily:"Nunito",fontSize:17,fontWeight:900,letterSpacing:2.3,color:ORANGE,opacity:cta}}>
        VOS ACHATS EUROPÉENS, EN TOUTE SIMPLICITÉ.
      </div>
    </AbsoluteFill>
  );
}

function MainVideo() {
  const f = useCurrentFrame();
  const css = "";
  return (
    <AbsoluteFill style={{overflow:"hidden"}}>
      <style>{css}</style>
      <Audio src={staticFile("assets/background.mp3")} volume={0.045}/>
      <Audio src={staticFile("audio/voice-over.mp3")} volume={1}/>
      {f < 231 ? <Hook/> :
       f < 318 ? <Problem/> :
       f < 498 ? <Olosto/> :
       f < 603 ? <Action/> :
       f < 891 ? <Fluid/> :
       <Final/>}
    </AbsoluteFill>
  );
}

function RemotionRoot() {
  return <Composition id="MainVideo" component={MainVideo} durationInFrames={1050} fps={30} width={1080} height={1920}/>;
}

registerRoot(RemotionRoot);