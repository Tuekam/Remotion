import React from "react";
import {
  AbsoluteFill, Audio, Composition, Img, Sequence, staticFile,
  interpolate, spring, useCurrentFrame, useVideoConfig, registerRoot
} from "remotion";

const NAVY = "#004369";
const ORANGE = "#DA6220";
const WHITE = "#FFFFFF";
const PALE = "#F4F8FA";
const INK = "#163444";
const MUTED = "#6D7E87";
const FPS = 30;
const DURATION = 917;

const ms = (n:number) => Math.round(n / 1000 * FPS);
const ease = (t:number) => 1 - Math.pow(1 - Math.max(0,Math.min(1,t)), 3);

const scenes = [
  {from:ms(80), to:ms(2740), kind:"hook"},
  {from:ms(3360), to:ms(6460), kind:"problem"},
  {from:ms(6920), to:ms(7680), kind:"brand"},
  {from:ms(8000), to:ms(11760), kind:"choose"},
  {from:ms(12320), to:ms(13740), kind:"takeover"},
  {from:ms(14080), to:ms(16660), kind:"route"},
  {from:ms(17260), to:ms(21440), kind:"value"},
  {from:ms(21920), to:ms(24540), kind:"promise"},
  {from:ms(25060), to:ms(28140), kind:"benefit"},
  {from:ms(28540), to:ms(30240), kind:"cta"},
];

const fontFaces = `
@font-face{font-family:Nunito;src:url("${staticFile("fonts/Nunito/Nunito-Regular.ttf")}") format("truetype");font-weight:400}
@font-face{font-family:Nunito;src:url("${staticFile("fonts/Nunito/Nunito-Bold.ttf")}") format("truetype");font-weight:700}
@font-face{font-family:Luckybones;src:url("${staticFile("fonts/Luckybones/Luckybones-Bold.otf")}") format("opentype");font-weight:700}
*{box-sizing:border-box}
`;

function anim(frame:number, start:number, end:number, from=0, to=1){
  return interpolate(frame,[start,end],[from,to],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
}
function Logo({style}: {style?:React.CSSProperties}){
  return <Img src={staticFile("assets/logo.jpeg")} style={{width:230,height:"auto",objectFit:"contain",...style}} />;
}
function Pill({children, active=false}:{children:React.ReactNode;active?:boolean}){
  return <div style={{padding:"14px 22px",borderRadius:999,border:"1px solid "+(active?ORANGE:"#D7E3E8"),background:active?ORANGE:WHITE,color:active?WHITE:NAVY,fontFamily:"Nunito",fontWeight:700,fontSize:22,letterSpacing:.3}}>{children}</div>;
}
function DotGrid(){
  return <div style={{position:"absolute",inset:0,opacity:.18,backgroundImage:"radial-gradient("+NAVY+" 1px, transparent 1px)",backgroundSize:"34px 34px"}} />;
}
function EcomCard({x=0,y=0,scale=1,opacity=1,tilt=0,highlight=false}:{x?:number;y?:number;scale?:number;opacity?:number;tilt?:number;highlight?:boolean}){
 return <div style={{position:"absolute",left:x,top:y,width:720,height:500,transform:"scale("+scale+") rotate("+tilt+"deg)",transformOrigin:"center",opacity,background:WHITE,borderRadius:34,border:"1px solid #DDE8EC",boxShadow:"0 30px 80px rgba(0,67,105,.14)",fontFamily:"Nunito",overflow:"hidden"}}>
   <div style={{height:74,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #E6EEF1"}}>
    <div style={{display:"flex",gap:9}}><span style={{width:12,height:12,borderRadius:20,background:"#DDE8EC"}}/><span style={{width:12,height:12,borderRadius:20,background:"#DDE8EC"}}/><span style={{width:12,height:12,borderRadius:20,background:"#DDE8EC"}}/></div>
    <div style={{fontSize:20,fontWeight:700,color:MUTED}}>EUROPE • SHOP</div>
    <div style={{fontSize:24,color:NAVY}}>⌕</div>
   </div>
   <div style={{padding:34,display:"flex",gap:28}}>
    <div style={{width:270,height:300,borderRadius:24,background:"linear-gradient(145deg,#EAF3F6,#F9FBFC)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <div style={{width:130,height:180,borderRadius:18,background:highlight?ORANGE:NAVY,opacity:.92,transform:"rotate(-7deg)",boxShadow:"0 18px 35px rgba(0,67,105,.2)"}}/>
      <div style={{position:"absolute",bottom:18,left:18,fontSize:17,color:MUTED}}>PREMIUM PRODUCT</div>
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:19,color:MUTED,letterSpacing:2}}>FEATURED</div>
      <div style={{fontSize:38,fontWeight:700,color:NAVY,marginTop:8}}>Design Product</div>
      <div style={{fontSize:28,fontWeight:700,color:INK,marginTop:18}}>€249</div>
      <div style={{marginTop:36,height:58,borderRadius:16,background:highlight?ORANGE:NAVY,color:WHITE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,fontWeight:700}}>ADD TO CART</div>
      <div style={{marginTop:18,fontSize:18,color:MUTED}}>EU delivery available</div>
    </div>
   </div>
 </div>
}
function Route({progress}:{progress:number}){
 const px = 160 + progress*760;
 return <div style={{position:"absolute",left:140,right:140,top:790,height:240}}>
   <div style={{position:"absolute",left:0,right:0,top:96,height:3,background:"#C8DCE4"}}/>
   <div style={{position:"absolute",left:0,width:Math.max(0,px-140),top:96,height:6,background:ORANGE,borderRadius:9}}/>
   <div style={{position:"absolute",left:70,top:60,width:76,height:76,borderRadius:50,background:NAVY,display:"flex",alignItems:"center",justifyContent:"center",color:WHITE,fontFamily:"Nunito",fontWeight:700,fontSize:20}}>EU</div>
   <div style={{position:"absolute",right:70,top:60,width:76,height:76,borderRadius:50,background:ORANGE,display:"flex",alignItems:"center",justifyContent:"center",color:WHITE,fontFamily:"Nunito",fontWeight:700,fontSize:20}}>CM</div>
   <div style={{position:"absolute",left:px,top:62,width:70,height:58,borderRadius:13,background:WHITE,border:"2px solid "+NAVY,boxShadow:"0 12px 24px rgba(0,67,105,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Nunito",fontWeight:700,color:NAVY,fontSize:18}}>COLIS</div>
 </div>
}
function Scene({kind,local}:{kind:string;local:number}){
 const f=local;
 if(kind==="hook") return <AbsoluteFill style={{background:PALE}}><DotGrid/><EcomCard x={220+anim(f,0,70,0,70)} y={360} scale={.94+anim(f,0,70,0,.06)} highlight/><div style={{position:"absolute",left:110,top:150,fontFamily:"Luckybones",fontSize:76,color:NAVY,letterSpacing:1,opacity:anim(f,4,30)}}>UN PRODUIT <span style={{color:ORANGE}}>EN EUROPE ?</span></div><div style={{position:"absolute",right:110,top:1020,display:"flex",gap:14,opacity:anim(f,35,55)}}><Pill active>€249</Pill><Pill>ADD TO CART</Pill></div></AbsoluteFill>;
 if(kind==="problem") return <AbsoluteFill style={{background:WHITE}}><div style={{position:"absolute",inset:0,background:"linear-gradient(120deg,#F7FAFB,#EEF5F7)"}}/><EcomCard x={-130+anim(f,0,55,0,-190)} y={300} scale={.9} tilt={-5} opacity={anim(f,0,20)}/><div style={{position:"absolute",left:620,top:340,width:300,height:540,display:"flex",flexDirection:"column",gap:18,opacity:anim(f,10,40)}}><Pill>PAIEMENT</Pill><Pill>ADRESSE</Pill><Pill active>EXPÉDITION</Pill></div><div style={{position:"absolute",left:100,top:1040,fontFamily:"Luckybones",fontSize:65,color:NAVY,lineHeight:1.05}}>ACHETER EN EUROPE,<br/><span style={{color:ORANGE}}>DEPUIS LE CAMEROUN...</span></div><div style={{position:"absolute",left:100,top:1210,fontFamily:"Nunito",fontWeight:700,fontSize:28,color:MUTED,opacity:anim(f,55,75)}}>...PEUT DEVENIR COMPLIQUÉ.</div></AbsoluteFill>;
 if(kind==="brand") return <AbsoluteFill style={{background:NAVY}}><DotGrid/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:50}}><Logo style={{width:290,transform:"scale("+(.65+anim(f,0,20,.0,.35))+")",opacity:anim(f,0,12)}}/><div style={{width:260,height:5,background:ORANGE,transform:"scaleX("+anim(f,12,28,0,1)+")",borderRadius:8}}/><div style={{fontFamily:"Luckybones",fontSize:64,color:WHITE,opacity:anim(f,25,42),letterSpacing:1}}>VOTRE FACILITATEUR D'ACHAT.</div></div></AbsoluteFill>;
 if(kind==="choose") return <AbsoluteFill style={{background:PALE}}><div style={{position:"absolute",left:100,top:170,fontFamily:"Luckybones",fontSize:72,color:NAVY}}>VOUS <span style={{color:ORANGE}}>CHOISISSEZ</span></div><div style={{position:"absolute",left:100,top:280,fontFamily:"Nunito",fontSize:28,color:MUTED,fontWeight:700}}>Votre produit sur votre site européen préféré.</div><EcomCard x={140+anim(f,0,80,0,320)} y={470} scale={.72+anim(f,0,50,0,.18)} tilt={-3+anim(f,50,110,-3,2)} highlight/></AbsoluteFill>;
 if(kind==="takeover") return <AbsoluteFill style={{background:WHITE}}><EcomCard x={-420+anim(f,0,45,0,480)} y={480} scale={.55} opacity={1-anim(f,35,75,.0,.85)} highlight/><div style={{position:"absolute",left:390,top:650,width:300,height:300,borderRadius:80,background:NAVY,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 25px 60px rgba(0,67,105,.2)",transform:"scale("+(.65+anim(f,10,40,0,.35))+")"}}><Logo style={{width:190}}/></div><div style={{position:"absolute",left:120,top:1120,fontFamily:"Luckybones",fontSize:58,color:NAVY}}>OLOSTO PREND <span style={{color:ORANGE}}>LE RELAIS</span></div><div style={{position:"absolute",left:120,top:1210,fontFamily:"Nunito",fontSize:28,fontWeight:700,color:MUTED}}>Nous facilitons votre achat.</div></AbsoluteFill>;
 if(kind==="route") return <AbsoluteFill style={{background:PALE}}><div style={{position:"absolute",left:100,top:180,fontFamily:"Luckybones",fontSize:76,color:NAVY}}>VOTRE <span style={{color:ORANGE}}>COLIS VOYAGE</span></div><div style={{position:"absolute",left:100,top:300,fontFamily:"Nunito",fontSize:28,color:MUTED,fontWeight:700}}>De l'Europe jusqu'au Cameroun.</div><Route progress={anim(f,0,72)}/><div style={{position:"absolute",left:100,top:1180,fontFamily:"Luckybones",fontSize:62,color:NAVY,opacity:anim(f,55,80)}}>JUSQU'AU CAMEROUN.</div></AbsoluteFill>;
 if(kind==="value") return <AbsoluteFill style={{background:NAVY}}><div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 75% 30%,rgba(218,98,32,.22),transparent 32%)"}}/><div style={{position:"absolute",left:100,top:210,fontFamily:"Nunito",fontSize:24,fontWeight:700,color:"#B9D3DE",letterSpacing:3}}>DU PANIER À L'ACHEMINEMENT</div><div style={{position:"absolute",left:100,top:310,fontFamily:"Luckybones",fontSize:74,color:WHITE,lineHeight:1.02,transform:"translateX("+anim(f,0,30,-80,0)+"px)",opacity:anim(f,0,25)}}>OLOSTO SIMPLIFIE<br/><span style={{color:ORANGE}}>VOS ACHATS INTERNATIONAUX.</span></div><div style={{position:"absolute",right:100,top:940,width:420,height:300,border:"1px solid rgba(255,255,255,.25)",borderRadius:34,transform:"rotate("+anim(f,0,70,-8,3)+"deg) scale("+(.85+anim(f,0,35,0,.15))+")",opacity:anim(f,15,45)}}><div style={{padding:30,fontFamily:"Nunito",color:WHITE,fontSize:24,fontWeight:700}}>ORDER CONFIRMED</div><div style={{margin:"20px 30px",height:4,background:ORANGE}}/><div style={{padding:"10px 30px",fontFamily:"Nunito",color:"#B9D3DE",fontSize:20}}>Purchase → Forwarding</div></div></AbsoluteFill>;
 if(kind==="promise") return <AbsoluteFill style={{background:WHITE}}><div style={{position:"absolute",left:90,top:420,fontFamily:"Luckybones",fontSize:92,color:NAVY,transform:"translateY("+anim(f,0,35,80,0)+"px)",opacity:anim(f,0,28)}}>ACHETEZ <span style={{color:ORANGE}}>EN EUROPE.</span></div><div style={{position:"absolute",left:90,top:610,fontFamily:"Luckybones",fontSize:70,color:NAVY,transform:"translateY("+anim(f,35,70,80,0)+"px)",opacity:anim(f,35,65)}}>NOUS NOUS OCCUPONS DU RESTE.</div><div style={{position:"absolute",left:90,top:800,width:850,height:6,background:ORANGE,transformOrigin:"left",transform:"scaleX("+anim(f,55,90,0,1)+")"}}/></AbsoluteFill>;
 if(kind==="benefit") return <AbsoluteFill style={{background:PALE}}><div style={{position:"absolute",left:90,top:230,fontFamily:"Luckybones",fontSize:76,color:NAVY}}>VOS ACHATS EUROPÉENS.</div><div style={{position:"absolute",left:90,top:350,fontFamily:"Luckybones",fontSize:92,color:ORANGE,transform:"scale("+(.8+anim(f,20,50,0,.2))+")",transformOrigin:"left"}}>PLUS SIMPLES.</div><div style={{position:"absolute",left:90,top:520,fontFamily:"Luckybones",fontSize:68,color:NAVY,opacity:anim(f,40,70)}}>AVEC OLOSTO.</div><div style={{position:"absolute",right:100,top:850,width:260,height:260,borderRadius:70,background:NAVY,display:"flex",alignItems:"center",justifyContent:"center",transform:"rotate("+anim(f,0,90,-12,12)+"deg) scale("+(.7+anim(f,0,35,0,.3))+")"}}><Logo style={{width:175}}/></div></AbsoluteFill>;
 return <AbsoluteFill style={{background:NAVY}}><div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 35%,rgba(218,98,32,.2),transparent 35%)"}}/><Logo style={{position:"absolute",left:"50%",top:240,width:310,transform:"translateX(-50%) scale("+(.65+anim(f,0,28,0,.35))+")",opacity:anim(f,0,18)}}/><div style={{position:"absolute",left:80,right:80,top:720,textAlign:"center",fontFamily:"Luckybones",fontSize:78,lineHeight:1.02,color:WHITE,opacity:anim(f,15,38)}}>CONFIEZ VOS ACHATS<br/><span style={{color:ORANGE}}>À OLOSTO.</span></div><div style={{position:"absolute",left:160,right:160,top:1100,height:82,borderRadius:22,background:ORANGE,color:WHITE,fontFamily:"Nunito",fontWeight:700,fontSize:29,display:"flex",alignItems:"center",justifyContent:"center",transform:"translateY("+anim(f,35,65,50,0)+"px)",opacity:anim(f,35,55)}}>Confiez vos achats à OLOSTO.</div></AbsoluteFill>;
}

function MainVideo(){
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const current=[...scenes].reverse().find(s=>frame>=s.from)||scenes[0];
 const local=frame-current.from;
 return <AbsoluteFill style={{fontFamily:"Nunito",background:WHITE,overflow:"hidden"}}>
   <style>{fontFaces}</style>
   <Sequence from={0} durationInFrames={DURATION}><Audio src={staticFile("audio/voice-over.mp3")} volume={1}/><Audio src={staticFile("assets/background.mp3")} volume={0.13}/></Sequence>
   <Scene kind={current.kind} local={local}/>
   <div style={{position:"absolute",left:54,right:54,bottom:48,height:5,borderRadius:10,background:"rgba(0,67,105,.12)"}}><div style={{height:"100%",width:(frame/DURATION*100)+"%",background:ORANGE,borderRadius:10}}/></div>
 </AbsoluteFill>
}
function Root(){ return <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920}/>; }
registerRoot(Root);