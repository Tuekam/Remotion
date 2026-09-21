import React from "react";
import {Audio, Composition, Img, Sequence, AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, registerRoot} from "remotion";

const FPS = 30;
const DURATION_MS = 30354;
const DURATION = 911;
const C = { navy:"#004369", orange:"#DA6220", white:"#FFFFFF", ink:"#0B2230", mist:"#EEF3F5", soft:"#DCE8ED", line:"#B9CCD5" };

const sceneFrames = {
  hook: {from:0, dur:132},
  problem: {from:132, dur:241},
  brand: {from:373, dur:179},
  journey: {from:552, dur:83},
  promise: {from:635, dur:229},
  final: {from:864, dur:47}
};

const ease = (t:number) => 1-Math.pow(1-t,3);
const clamp = (n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
const progress=(frame:number,from:number,dur:number)=>clamp((frame-from)/dur);

const FontStyles = () => <style>{`
@font-face{font-family:Luckybones;src:url("${staticFile("fonts/Luckybones/Luckybones-Bold.otf")}") format("opentype");font-weight:700}
@font-face{font-family:Nunito;src:url("${staticFile("fonts/Nunito/Nunito-Regular.ttf")}") format("truetype");font-weight:400}
@font-face{font-family:Nunito;src:url("${staticFile("fonts/Nunito/Nunito-Bold.ttf")}") format("truetype");font-weight:700}
*{box-sizing:border-box} body{margin:0}
`}</style>;

const Grid = ({opacity=.12}:{opacity?:number}) => <div style={{position:"absolute",inset:0,opacity,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>;

const Logo = ({size=250,opacity=1}:{size?:number,opacity?:number}) => <Img src={staticFile("assets/logo.jpeg")} style={{width:size,height:"auto",objectFit:"contain",opacity}}/>;

const Kinetic = ({children,accent=false,size=78,from=0,dur=18,align="left"}:{children:React.ReactNode;accent?:boolean;size?:number;from?:number;dur?:number;align?:any}) => {
 const f=useCurrentFrame(); const p=ease(clamp((f-from)/dur)); const y=interpolate(p,[0,1],[48,0]); const s=interpolate(p,[0,1],[.92,1]);
 return <div style={{fontFamily:"Luckybones",fontSize:size,lineHeight:.94,color:accent?C.orange:C.white,transform:`translateY(${y}px) scale(${s})`,opacity:p,textAlign:align,letterSpacing:-1}}>{children}</div>
};

const Pill = ({children,active=false}:{children:React.ReactNode;active?:boolean}) => <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:22,color:active?C.white:C.navy,background:active?C.orange:"rgba(255,255,255,.78)",padding:"12px 20px",borderRadius:99,boxShadow:"0 12px 30px rgba(0,35,55,.12)",display:"inline-flex",alignItems:"center",gap:10}}>{children}</div>;

const ProductCard = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/75)); const x=interpolate(p,[0,1],[520,0]); const rot=interpolate(p,[0,1],[4,0]);
 return <div style={{width:610,height:760,borderRadius:38,background:"rgba(255,255,255,.94)",boxShadow:"0 35px 80px rgba(0,25,40,.28)",transform:`translateX(${x}px) rotate(${rot}deg)`,overflow:"hidden"}}>
   <div style={{height:390,background:"linear-gradient(135deg,#f7fafb,#dbe8ed)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
     <div style={{width:210,height:260,borderRadius:30,background:"linear-gradient(145deg,#ffffff,#c8d7dd)",boxShadow:"0 28px 35px rgba(0,67,105,.18)",transform:"rotate(-8deg)"}}/>
     <div style={{position:"absolute",right:28,top:28}}><Pill active>EUROPE</Pill></div>
   </div>
   <div style={{padding:"32px 34px",fontFamily:"Nunito"}}>
     <div style={{fontSize:20,color:"#6B7E87",letterSpacing:1}}>ÉDITION PREMIUM</div>
     <div style={{fontSize:42,fontWeight:700,color:C.ink,marginTop:8}}>Votre produit</div>
     <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:25}}>
       <div style={{fontSize:36,fontWeight:700,color:C.navy}}>€249</div>
       <div style={{background:C.orange,color:"#fff",padding:"16px 28px",borderRadius:16,fontWeight:700,fontSize:22}}>AJOUTER</div>
     </div>
   </div>
 </div>
};

const Hook = () => {
 const f=useCurrentFrame(); const scan=interpolate((f%70)/70,[0,1],[-100,100]);
 return <AbsoluteFill style={{background:"radial-gradient(circle at 70% 20%,#176080 0,#004369 42%,#022C46 100%)",fontFamily:"Nunito"}}>
   <Grid opacity={.16}/>
   <div style={{position:"absolute",left:60,top:90}}><Pill>SHOP EUROPE</Pill></div>
   <div style={{position:"absolute",right:-40,top:170}}><ProductCard/></div>
   <div style={{position:"absolute",left:72,top:500,width:620}}>
     <Kinetic size={98} from={4}>UN PRODUIT</Kinetic>
     <Kinetic size={98} accent from={13}>EN EUROPE ?</Kinetic>
   </div>
   <div style={{position:"absolute",left:72,bottom:105,width:610,height:3,background:"rgba(255,255,255,.18)",overflow:"hidden"}}><div style={{height:"100%",width:"34%",background:C.orange,transform:`translateX(${scan}px)`}}/></div>
 </AbsoluteFill>
};

const Problem = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/130));
 const nodes=[["PANIER",70,250],["ADRESSE",310,470],["EXPÉDITION",550,690],["CAMEROUN",300,900]];
 return <AbsoluteFill style={{background:"#F5F8F9",fontFamily:"Nunito",color:C.ink}}>
   <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 20% 20%,#ffffff 0,transparent 35%),linear-gradient(140deg,#F5F8F9,#DDE9EE)"}}/>
   <div style={{position:"absolute",left:70,top:95}}><div style={{fontSize:20,fontWeight:700,color:C.orange,letterSpacing:2}}>LE PARCOURS</div><div style={{fontFamily:"Luckybones",fontSize:78,color:C.navy,lineHeight:.95,marginTop:14}}>PEUT SE<br/>COMPLIQUER.</div></div>
   <div style={{position:"absolute",left:70,top:610,fontFamily:"Nunito",fontSize:30,color:"#607782",width:850}}>Paiement. Adresse. Expédition. Arrivée.</div>
   {nodes.map(([label,x,y],i)=><div key={String(label)} style={{position:"absolute",left:Number(x),top:Number(y),padding:"18px 24px",borderRadius:18,background:i===3?C.navy:"#fff",color:i===3?"#fff":C.navy,fontWeight:700,fontSize:22,boxShadow:"0 18px 35px rgba(0,67,105,.12)",transform:`translateY(${interpolate(p,[0,1],[30-i*8,0])}px) scale(${.92+p*.08})`,opacity:p}}>{label}</div>)}
   <svg width="1080" height="1920" style={{position:"absolute",inset:0,pointerEvents:"none"}}><path d="M180 290 C360 420 680 360 610 520 C530 690 410 780 600 900" fill="none" stroke={C.orange} strokeWidth="5" strokeDasharray="14 18" strokeLinecap="round" opacity=".8"/></svg>
   <div style={{position:"absolute",right:60,bottom:110,width:270,height:270,borderRadius:"50%",border:`2px solid ${C.orange}`,display:"flex",alignItems:"center",justifyContent:"center",transform:`rotate(${f*.3}deg)`}}><div style={{fontFamily:"Luckybones",fontSize:42,color:C.navy,textAlign:"center"}}>DEPUIS<br/>LE CAMEROUN</div></div>
 </AbsoluteFill>
};

const Brand = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/50)); const scale=interpolate(p,[0,1],[.72,1]); const line=interpolate(clamp((f-38)/30),[0,1],[0,760]);
 return <AbsoluteFill style={{background:"radial-gradient(circle at 50% 45%,#0B5B7D 0,#004369 48%,#022D46 100%)",fontFamily:"Nunito"}}>
   <Grid opacity={.1}/>
   <div style={{position:"absolute",left:540,top:650,transform:`translate(-50%,-50%) scale(${scale})`}}><Logo size={410}/></div>
   <div style={{position:"absolute",left:540,top:1120,transform:"translateX(-50%)",textAlign:"center"}}>
     <div style={{fontFamily:"Luckybones",fontSize:62,color:"#fff"}}>VOTRE FACILITATEUR</div>
     <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:34,color:"#D8E7ED",marginTop:8}}>D’ACHAT.</div>
     <div style={{height:5,width:line,background:C.orange,borderRadius:9,margin:"30px auto 0"}}/>
   </div>
   <div style={{position:"absolute",left:85,top:90}}><Pill active>OLOSTO</Pill></div>
 </AbsoluteFill>
};

const Journey = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/83)); const x=interpolate(p,[0,1],[0,720]);
 return <AbsoluteFill style={{background:"#F7FAFB",fontFamily:"Nunito"}}>
   <div style={{position:"absolute",left:60,top:110,fontFamily:"Luckybones",fontSize:76,color:C.navy}}>DE L’ACHAT<br/>AU COLIS.</div>
   <div style={{position:"absolute",left:60,top:450,width:960,height:2,background:"#C8D7DD"}}><div style={{height:8,width:18,borderRadius:"50%",background:C.orange,position:"absolute",top:-3,left:x}}/><div style={{height:2,width:x,background:C.orange}}/></div>
   <div style={{position:"absolute",left:70,top:570}}><Pill active>1 · VOUS CHOISISSEZ</Pill></div>
   <div style={{position:"absolute",left:360,top:570}}><Pill>2 · OLOSTO PREND LE RELAIS</Pill></div>
   <div style={{position:"absolute",left:80,top:720,fontSize:30,color:"#637985"}}>Votre produit sur votre site européen préféré.</div>
   <div style={{position:"absolute",right:70,bottom:110,width:220,height:220,borderRadius:32,background:C.navy,transform:`translateY(${interpolate(p,[0,1],[80,0])}px) rotate(${interpolate(p,[0,1],[8,0])}deg)`,boxShadow:"0 30px 60px rgba(0,67,105,.22)"}}>
      <div style={{color:"#fff",fontFamily:"Luckybones",fontSize:40,padding:28}}>OLOSTO<br/><span style={{color:C.orange}}>→</span></div>
   </div>
 </AbsoluteFill>
};

const Promise = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/90)); const travel=interpolate(clamp(f/105),[0,1],[0,1]);
 return <AbsoluteFill style={{background:"linear-gradient(135deg,#003A59,#004369 55%,#0A607E)",fontFamily:"Nunito"}}>
   <Grid opacity={.1}/>
   <div style={{position:"absolute",left:65,top:105,fontSize:20,fontWeight:700,color:"#AFC5CE",letterSpacing:3}}>TRAJET EUROPE → CAMEROUN</div>
   <div style={{position:"absolute",left:70,top:210,fontFamily:"Luckybones",fontSize:104,color:"#fff",lineHeight:.9}}>VOTRE<br/><span style={{color:C.orange}}>COLIS</span><br/>VOYAGE.</div>
   <svg width="1080" height="1920" style={{position:"absolute",inset:0}}><path d="M120 1120 C310 900 680 1240 940 930" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="3"/><path d="M120 1120 C310 900 680 1240 940 930" fill="none" stroke={C.orange} strokeWidth="6" strokeDasharray="18 22" strokeDashoffset={-f*10} strokeLinecap="round"/></svg>
   <div style={{position:"absolute",left:75,top:1065,width:26,height:26,borderRadius:"50%",background:C.orange,boxShadow:"0 0 0 12px rgba(218,98,32,.16)"}}/>
   <div style={{position:"absolute",right:100,top:875,width:26,height:26,borderRadius:"50%",background:"#fff",boxShadow:"0 0 0 12px rgba(255,255,255,.12)"}}/>
   <div style={{position:"absolute",left:interpolate(travel,[0,1],[80,855]),top:interpolate(travel,[0,1],[1080,885]),width:94,height:70,borderRadius:14,background:"#fff",boxShadow:"0 20px 35px rgba(0,0,0,.25)",transform:`rotate(${interpolate(travel,[0,1],[-8,4])}deg)`}}><div style={{height:12,width:55,background:C.orange,margin:"15px auto 0",borderRadius:4}}/></div>
   <div style={{position:"absolute",left:70,bottom:130,fontFamily:"Luckybones",fontSize:72,color:"#fff"}}>JUSQU’AU <span style={{color:C.orange}}>CAMEROUN.</span></div>
 </AbsoluteFill>
};

const Final = () => {
 const f=useCurrentFrame(); const p=ease(clamp(f/47)); const y=interpolate(p,[0,1],[30,0]);
 return <AbsoluteFill style={{background:"#F7FAFB",fontFamily:"Nunito"}}>
   <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 35%,#fff 0,#EDF3F5 55%,#DCE8ED 100%)"}}/>
   <div style={{position:"absolute",left:540,top:320,transform:`translate(-50%,${y}px) scale(${.92+p*.08})`,opacity:p}}><Logo size={310}/></div>
   <div style={{position:"absolute",left:540,top:790,transform:"translateX(-50%)",textAlign:"center",width:900}}>
     <div style={{fontFamily:"Luckybones",fontSize:92,color:C.navy,lineHeight:.9}}>VOS ACHATS<br/><span style={{color:C.orange}}>PLUS SIMPLES.</span></div>
     <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:34,color:C.ink,marginTop:42}}>AVEC OLOSTO.</div>
   </div>
   <div style={{position:"absolute",left:540,bottom:170,transform:"translateX(-50%)",background:C.navy,color:"#fff",padding:"22px 42px",borderRadius:18,fontSize:28,fontWeight:700,boxShadow:"0 22px 50px rgba(0,67,105,.22)"}}>Confiez vos achats à OLOSTO.</div>
 </AbsoluteFill>
};

const AudioLayer = () => <><Audio src={staticFile("audio/voice-over.mp3")} volume={1}/><Audio src={staticFile("assets/background.mp3")} volume={0.12}/></>;

const MainVideo = () => <AbsoluteFill><FontStyles/><AudioLayer/>
 <Sequence {...sceneFrames.hook}><Hook/></Sequence>
 <Sequence {...sceneFrames.problem}><Problem/></Sequence>
 <Sequence {...sceneFrames.brand}><Brand/></Sequence>
 <Sequence {...sceneFrames.journey}><Journey/></Sequence>
 <Sequence {...sceneFrames.promise}><Promise/></Sequence>
 <Sequence {...sceneFrames.final}><Final/></Sequence>
</AbsoluteFill>;

registerRoot(() => <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920}/>);
