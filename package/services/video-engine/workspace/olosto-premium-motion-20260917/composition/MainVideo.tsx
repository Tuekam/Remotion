import React from "react";
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from "remotion";

const BLUE="#004369", ORANGE="#DA6220", WHITE="#FFFFFF";
const FPS=30, DURATION=1237;
// Timings sourced from verified ElevenLabs word segments returned by get_voice_over.
const SCENES=[
  {from:0,to:93,kicker:"VOUS L’AVEZ",title:"REPÉRÉ.",sub:"EN EUROPE",mode:"shop"},
  {from:93,to:203,kicker:"MAIS…",title:"COMMENT",sub:"L’AMENER AU CAMEROUN ?",mode:"problem"},
  {from:203,to:302,kicker:"OLOSTO",title:"PREND",sub:"LE RELAIS.",mode:"logo"},
  {from:302,to:438,kicker:"VOUS",title:"CHOISISSEZ.",sub:"VOUS COMMANDEZ.",mode:"order"},
  {from:438,to:685,kicker:"NOUS",title:"FACILITONS",sub:"VOS ACHATS.",mode:"relay"},
  {from:685,to:840,kicker:"EUROPE",title:"→",sub:"CAMEROUN",mode:"travel"},
  {from:840,to:958,kicker:"VOUS ACHETEZ.",title:"OLOSTO",sub:"FACILITE LE RESTE.",mode:"promise"},
  {from:958,to:1237,kicker:"PLUS SIMPLE",title:"AVEC",sub:"OLOSTO.",mode:"final"},
];
const enter=(f:number,start:number,span=18)=>spring({frame:Math.max(0,f-start),fps:FPS,config:{damping:15,stiffness:180,mass:.65}});

const Scene=({scene,index}:{scene:(typeof SCENES)[number];index:number})=>{
 const f=useCurrentFrame(); const local=f-scene.from; const p=Math.max(0,Math.min(1,local/(scene.to-scene.from)));
 const inP=enter(f,scene.from); const outP=Math.max(0,Math.min(1,(scene.to-f)/16));
 const x=interpolate(inP,[0,1],[140,0]); const rot=interpolate(p,[0,1],[-5,4]);
 const isTravel=scene.mode==="travel"; const isLogo=scene.mode==="logo"||scene.mode==="final";
 const parcelX=interpolate(p,[0,1],[-180,2150]); const sweep=interpolate(p,[0,1],[-120,2200]);
 return <AbsoluteFill style={{opacity:outP,overflow:"hidden",background:index%2?"#f7f9fa":BLUE,color:index%2?BLUE:WHITE,fontFamily:"Arial, sans-serif"}}>
   <div style={{position:"absolute",inset:-180,background:isTravel?"radial-gradient(circle at 75% 50%, #0b658e 0, #004369 48%, #002c46 100%)":index%2?"linear-gradient(135deg,#fff 0%,#eef4f6 100%)":"radial-gradient(circle at 70% 20%,#14658a 0,#004369 48%,#002c46 100%)",transform:`scale(${1+p*.16}) rotate(${rot}deg)`}}/>
   {Array.from({length:18}).map((_,i)=><i key={i} style={{position:"absolute",width:4+(i%3)*3,height:4+(i%3)*3,borderRadius:99,background:i%4===0?ORANGE:"rgba(255,255,255,.25)",left:`${(i*17+local*(i%2?-.45:.3))%110}%`,top:`${(i*29+local*.25)%105}%`}}/>)}
   <div style={{position:"absolute",height:10,width:"130%",left:sweep-300,top:"56%",background:ORANGE,transform:"rotate(-12deg)",boxShadow:"0 0 30px #da6220"}}/>
   {scene.mode==="shop"&&<div style={{position:"absolute",right:130,top:190,width:470,height:420,background:WHITE,borderRadius:30,padding:35,boxShadow:"0 30px 70px #001d2f88",transform:`translateX(${x}px) rotate(${rot}deg)`}}><div style={{height:185,borderRadius:18,background:"linear-gradient(135deg,#d5e7ee,#8ec3d5)"}}/><div style={{marginTop:25,width:180,height:24,background:BLUE,borderRadius:12}}/><div style={{marginTop:18,width:100,height:38,background:ORANGE,borderRadius:19}}/></div>}
   {scene.mode==="problem"&&["PAYMENT","ADDRESS","DELIVERY"].map((t,i)=><div key={t} style={{position:"absolute",left:880+Math.cos(local*.07+i*2)*330,top:400+Math.sin(local*.07+i*2)*220,padding:"18px 28px",border:"2px solid "+ORANGE,borderRadius:50,fontWeight:800,background:BLUE,color:WHITE}}>{t}</div>)}
   {(scene.mode==="order"||scene.mode==="relay"||isTravel)&&<div style={{position:"absolute",left:isTravel?parcelX:1050-x/2,top:isTravel?430:355,width:190,height:135,borderRadius:14,background:"linear-gradient(135deg,#eea05d,#da6220)",boxShadow:"20px 25px 40px #001d2f88",transform:`rotate(${-8+Math.sin(local*.12)*6}deg)`}}><div style={{position:"absolute",left:82,top:0,width:24,height:"100%",background:"#f2c28e"}}/></div>}
   {isLogo&&<div style={{position:"absolute",right:115,top:260,width:680,transform:`scale(${.7+inP*.3}) rotate(${(1-inP)*-8}deg)`}}><Img src={staticFile("assets/logo.jpeg")} style={{width:"100%",filter:"drop-shadow(0 24px 20px #001d2f66)"}}/></div>}
   {isTravel&&<><div style={{position:"absolute",left:210,top:270,fontSize:38,fontWeight:900}}>EUROPE</div><div style={{position:"absolute",right:160,top:650,fontSize:38,fontWeight:900}}>CAMEROUN</div></>}
   <div style={{position:"absolute",left:110,top:"31%",maxWidth:780,transform:`translateX(${x}px)`}}>
     <div style={{fontSize:34,fontWeight:900,letterSpacing:7,color:ORANGE,marginBottom:22}}>{scene.kicker}</div>
     <div style={{fontSize:120,lineHeight:.84,fontWeight:950,letterSpacing:-5,whiteSpace:"pre-line"}}>{scene.title}</div>
     <div style={{fontSize:48,fontWeight:800,marginTop:28,letterSpacing:1,color:index%2?ORANGE:WHITE}}>{scene.sub}</div>
   </div>
   <div style={{position:"absolute",bottom:55,left:110,right:110,height:5,background:"rgba(255,255,255,.25)"}}><div style={{width:`${p*100}%`,height:"100%",background:ORANGE}}/></div>
 </AbsoluteFill>
};
const MainVideo=()=> <AbsoluteFill><Audio src={staticFile("audio/voice-over.mp3")} volume={1}/><Audio src={staticFile("assets/background.mp3")} volume={(f)=> f<24?0.06+f/24*.10:f>DURATION-45?0.16*(DURATION-f)/45:0.16}/>{SCENES.map((s,i)=><Sequence key={s.from} from={s.from} durationInFrames={s.to-s.from}><Scene scene={s} index={i}/></Sequence>)}</AbsoluteFill>;
const Root=()=> <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
