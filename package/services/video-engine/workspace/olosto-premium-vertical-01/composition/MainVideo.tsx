import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = { navy:"#004369", orange:"#DA6220", ink:"#062b42", ivory:"#F8FAFB", mist:"#EAF1F4", line:"rgba(0,67,105,.16)" };
const FPS = 30;
const DURATION = 1178;
// Timings are derived from ElevenLabs word segments returned by get_voice_over (39,262 ms).
const SCENES = { hook:[0,159], problem:[159,356], brand:[356,477], journey:[477,765], promise:[765,993], finale:[993,1178] };

const ease = (x:number) => Math.max(0, Math.min(1, x));
const rise = (f:number, from:number, d=18) => spring({frame:Math.max(0,f-from),fps:FPS,config:{damping:16,stiffness:110,mass:.7}});
const Text = ({children,style}:{children:React.ReactNode;style?:React.CSSProperties}) => <div style={{fontFamily:"Nunito, Arial, sans-serif",color:C.navy,...style}}>{children}</div>;
const Title = ({children,style}:{children:React.ReactNode;style?:React.CSSProperties}) => <Text style={{fontFamily:"Arial Black, Nunito, sans-serif",fontWeight:900,letterSpacing:-3,lineHeight:.9,...style}}>{children}</Text>;
const Pill = ({children,orange=false}:{children:React.ReactNode;orange?:boolean}) => <Text style={{display:"inline-flex",alignItems:"center",padding:"15px 25px",borderRadius:99,background:orange?C.orange:"rgba(255,255,255,.8)",color:orange?"white":C.navy,fontWeight:800,fontSize:24,letterSpacing:1,boxShadow:"0 12px 28px rgba(0,67,105,.09)"}}>{children}</Text>;

const Background = () => {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:C.ivory,overflow:"hidden"}}>
    <div style={{position:"absolute",width:1300,height:1300,borderRadius:"50%",background:"radial-gradient(circle, rgba(218,98,32,.13), rgba(218,98,32,0) 66%)",left:-580,top:-200,transform:`translateX(${Math.sin(f/90)*25}px)`}}/>
    <div style={{position:"absolute",width:1500,height:1100,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,67,105,.13), rgba(0,67,105,0) 67%)",right:-800,bottom:-450,transform:`translateX(${Math.cos(f/100)*35}px)`}}/>
    {[0,1,2].map(i=><div key={i} style={{position:"absolute",border:`1px solid ${C.line}`,width:800+i*270,height:800+i*270,borderRadius:"50%",right:-300-i*70,top:290-i*70,opacity:.55}}/>)}
  </AbsoluteFill>
};

const ProductCard = ({progress}:{progress:number}) => <div style={{position:"absolute",top:480,left:110,width:860,height:765,borderRadius:38,background:"rgba(255,255,255,.96)",boxShadow:"0 35px 85px rgba(0,67,105,.18)",overflow:"hidden",transform:`perspective(1400px) rotateY(-${5-progress*5}deg) rotateX(${2-progress*2}deg) translateY(${(1-progress)*60}px)`,opacity:progress}}>
  <div style={{height:62,padding:"0 34px",display:"flex",alignItems:"center",gap:13,borderBottom:`1px solid ${C.line}`}}><span style={{width:12,height:12,borderRadius:99,background:C.orange}}/><span style={{width:12,height:12,borderRadius:99,background:"#E9B07D"}}/><span style={{width:12,height:12,borderRadius:99,background:"#D9E4E8"}}/><Text style={{marginLeft:20,fontWeight:800,fontSize:20,opacity:.6}}>EUROPEAN STORE</Text></div>
  <div style={{padding:45}}>
    <div style={{height:355,borderRadius:25,background:"linear-gradient(135deg,#dce9ed,#fcfdfe)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:240,height:240,borderRadius:"50%",background:C.orange,opacity:.9,right:120,top:62}}/>
      <div style={{position:"absolute",width:270,height:135,borderRadius:28,background:C.navy,left:145,top:150,transform:"rotate(-18deg)",boxShadow:"0 22px 20px rgba(0,67,105,.23)"}}/>
      <div style={{position:"absolute",width:60,height:120,borderRadius:20,background:"#F2F7F8",left:245,top:160,transform:"rotate(-18deg)"}}/>
    </div>
    <Text style={{fontSize:29,fontWeight:900,marginTop:31}}>DESIGN ESSENTIAL</Text>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:15}}><Text style={{fontSize:44,fontWeight:900}}>€249</Text><Pill orange>AJOUTER AU PANIER</Pill></div>
  </div>
</div>;

const Logo = ({small=false}:{small?:boolean}) => <Img src={staticFile("assets/logo.jpeg")} style={{width:small?280:620,height:"auto",objectFit:"contain",mixBlendMode:"multiply"}}/>;

const Package = ({x,y,scale=1,rot=0}:{x:number;y:number;scale?:number;rot?:number}) => <div style={{position:"absolute",left:x,top:y,width:170*scale,height:125*scale,background:C.orange,borderRadius:13,transform:`rotate(${rot}deg)`,boxShadow:"0 20px 28px rgba(218,98,32,.26)"}}>
  <div style={{position:"absolute",left:"42%",top:0,width:27*scale,height:"100%",background:"#F5B077",opacity:.95}}/><div style={{position:"absolute",left:0,top:"47%",width:"100%",height:16*scale,background:"#D65214"}}/>
</div>;

const App = () => {
 const f=useCurrentFrame(); const {width,height}=useVideoConfig();
 const section=(s:[number,number])=>ease((f-s[0])/(s[1]-s[0]));
 const hook=section(SCENES.hook), prob=section(SCENES.problem), brand=section(SCENES.brand), trip=section(SCENES.journey), promise=section(SCENES.promise), finale=section(SCENES.finale);
 const visible=(a:number,b:number)=>f>=a&&f<b;
 return <AbsoluteFill><Background/>
  <Audio src={staticFile("assets/background.mp3")} volume={0.13}/>
  <Audio src={staticFile("audio/voice-over.mp3")} volume={1}/>
  {visible(...SCENES.hook) && <AbsoluteFill>
    <ProductCard progress={rise(f,0)}/>
    <div style={{position:"absolute",top:185,left:90,opacity:rise(f,18),transform:`translateY(${(1-rise(f,18))*35}px)`}}><Pill>ACHATS INTERNATIONAUX</Pill></div>
    <Title style={{position:"absolute",left:86,top:270,fontSize:99,width:900,opacity:rise(f,30)}}>UN PRODUIT<br/>EN <span style={{color:C.orange}}>EUROPE</span> ?</Title>
    <div style={{position:"absolute",right:95,top:1150,width:135,height:135,borderRadius:"50%",background:C.navy,display:"grid",placeItems:"center",color:"white",fontSize:55,boxShadow:"0 15px 35px rgba(0,67,105,.25)",transform:`scale(${rise(f,86)})`}}>+</div>
  </AbsoluteFill>}
  {visible(...SCENES.problem) && <AbsoluteFill>
    <div style={{position:"absolute",left:95,top:200,opacity:rise(f,165)}}><Pill orange>LE PARCOURS</Pill></div>
    <Title style={{position:"absolute",left:90,top:330,fontSize:88,width:890,opacity:rise(f,169)}}>ACHETER EN EUROPE,<br/>DEPUIS LE CAMEROUN...</Title>
    {["PAIEMENT","ADRESSE","EXPÉDITION","CAMEROUN"].map((label,i)=>{const p=rise(f,190+i*28); return <div key={label} style={{position:"absolute",left:i%2?560:130,top:650+Math.floor(i/2)*205,width:385,height:118,borderRadius:24,background:"white",boxShadow:"0 15px 36px rgba(0,67,105,.12)",display:"flex",alignItems:"center",paddingLeft:34,opacity:p,transform:`translateX(${(1-p)*(i%2?60:-60)}px)`}}><span style={{width:18,height:18,borderRadius:99,background:i===3?C.orange:C.navy,marginRight:18}}/><Text style={{fontWeight:900,fontSize:25}}>{label}</Text></div>})}
    <svg width="1080" height="900" style={{position:"absolute",top:550,left:0}}><path d="M320 160 C460 150 520 270 730 270 S 760 470 330 480" fill="none" stroke={C.orange} strokeWidth="7" strokeDasharray="900" strokeDashoffset={interpolate(prob,[0,1],[900,0])} /></svg>
    <Title style={{position:"absolute",left:92,bottom:165,fontSize:68,color:C.orange,opacity:rise(f,292)}}>...PEUT DEVENIR<br/>COMPLIQUÉ.</Title>
  </AbsoluteFill>}
  {visible(...SCENES.brand) && <AbsoluteFill style={{background:C.navy}}>
    {[0,1,2,3].map(i=><div key={i} style={{position:"absolute",width:130+i*190,height:130+i*190,border:`2px solid rgba(255,255,255,${.18-i*.03})`,borderRadius:"50%",left:540-(130+i*190)/2,top:960-(130+i*190)/2,transform:`scale(${.4+brand*1.4})`}}/>)}
    <div style={{position:"absolute",top:660,left:230,opacity:rise(f,375),transform:`scale(${.8+.2*rise(f,375)})`}}><div style={{background:"white",borderRadius:25,padding:"36px 55px",boxShadow:"0 20px 50px rgba(0,0,0,.23)"}}><Logo/></div></div>
    <Text style={{position:"absolute",top:1190,width:"100%",textAlign:"center",color:"white",fontSize:35,fontWeight:800,letterSpacing:3,opacity:rise(f,410)}}>VOTRE FACILITATEUR D’ACHAT</Text>
    <div style={{position:"absolute",top:1270,left:340,width:400,height:7,background:C.orange,transformOrigin:"left",transform:`scaleX(${rise(f,428)})`}}/>
  </AbsoluteFill>}
  {visible(...SCENES.journey) && <AbsoluteFill>
    {trip<.33 && <><div style={{position:"absolute",top:160,left:80}}><Pill>01 — VOUS CHOISISSEZ</Pill></div><ProductCard progress={rise(f,490)}/><Text style={{position:"absolute",left:95,bottom:150,fontSize:35,fontWeight:700,width:700}}>Votre produit sur votre site européen préféré.</Text></>}
    {trip>=.33 && trip<.66 && <><div style={{position:"absolute",top:155,left:80}}><Pill orange>02 — OLOSTO PREND LE RELAIS</Pill></div><div style={{position:"absolute",top:510,left:120,width:360,height:490,borderRadius:30,background:"white",boxShadow:"0 20px 48px rgba(0,67,105,.13)",padding:35}}><Text style={{fontSize:22,fontWeight:900,opacity:.5}}>VOTRE PANIER</Text><Text style={{fontSize:36,fontWeight:900,marginTop:90}}>€249</Text><div style={{height:8,background:C.orange,width:250,marginTop:40}}/></div><div style={{position:"absolute",left:450,top:730,width:200,height:7,background:C.orange,transform:`scaleX(${rise(f,570)})`,transformOrigin:"left"}}/><div style={{position:"absolute",right:100,top:570,opacity:rise(f,560)}}><Logo small/></div><Title style={{position:"absolute",left:100,bottom:195,fontSize:72}}>NOUS FACILITONS<br/><span style={{color:C.orange}}>VOTRE ACHAT.</span></Title></>}
    {trip>=.66 && <><div style={{position:"absolute",top:155,left:80}}><Pill>03 — VOTRE COLIS VOYAGE</Pill></div><Text style={{position:"absolute",top:390,left:95,fontSize:34,fontWeight:900,color:C.navy}}>EUROPE</Text><Text style={{position:"absolute",top:1160,right:92,fontSize:34,fontWeight:900,color:C.navy}}>CAMEROUN</Text><svg width="1080" height="1100" style={{position:"absolute",top:380,left:0}}><path d="M180 120 C840 140 220 750 850 780" fill="none" stroke={C.navy} strokeWidth="5" strokeDasharray="14 20" opacity=".35"/><path d="M180 120 C840 140 220 750 850 780" fill="none" stroke={C.orange} strokeWidth="8" strokeDasharray="1400" strokeDashoffset={interpolate((trip-.54)/.46,[0,1],[1400,0])}/></svg><div style={{position:"absolute",left:interpolate((trip-.54)/.46,[0,1],[145,770]),top:interpolate((trip-.54)/.46,[0,1],[480,1110])}}><Package x={0} y={0} scale={.72} rot={-8}/></div><Title style={{position:"absolute",left:95,bottom:165,fontSize:72}}>JUSQU’AU<br/><span style={{color:C.orange}}>CAMEROUN.</span></Title></>}
  </AbsoluteFill>}
  {visible(...SCENES.promise) && <AbsoluteFill style={{background:"linear-gradient(150deg,#f9fbfc,#e7f0f3)"}}>
    <div style={{position:"absolute",left:92,top:250,opacity:rise(f,775)}}><Pill orange>PLUS SIMPLE</Pill></div>
    <Title style={{position:"absolute",left:88,top:430,fontSize:107,opacity:rise(f,785)}}>ACHETEZ<br/>EN <span style={{color:C.orange}}>EUROPE.</span></Title>
    <Title style={{position:"absolute",left:88,top:770,fontSize:82,opacity:rise(f,850)}}>NOUS NOUS<br/>OCCUPONS DU <span style={{color:C.orange}}>RESTE.</span></Title>
    <Text style={{position:"absolute",left:92,bottom:180,width:800,fontSize:34,fontWeight:700,lineHeight:1.25,opacity:rise(f,900)}}>Du panier à l’acheminement,<br/>OLOSTO simplifie vos achats internationaux.</Text>
  </AbsoluteFill>}
  {visible(...SCENES.finale) && <AbsoluteFill style={{background:C.navy}}>
    <div style={{position:"absolute",top:350,left:160,opacity:rise(f,1000),transform:`scale(${.82+.18*rise(f,1000)})`}}><div style={{background:"white",padding:"30px 45px",borderRadius:24}}><Logo/></div></div>
    <Title style={{position:"absolute",top:850,width:"100%",textAlign:"center",fontSize:74,color:"white",opacity:rise(f,1025)}}>VOS ACHATS<br/>EUROPÉENS.</Title>
    <Title style={{position:"absolute",top:1035,width:"100%",textAlign:"center",fontSize:91,color:C.orange,opacity:rise(f,1060)}}>PLUS SIMPLES.</Title>
    <Text style={{position:"absolute",top:1195,width:"100%",textAlign:"center",color:"white",fontSize:42,fontWeight:900,letterSpacing:2,opacity:rise(f,1090)}}>AVEC OLOSTO.</Text>
    <div style={{position:"absolute",bottom:135,left:170,right:170,textAlign:"center",border:`2px solid ${C.orange}`,borderRadius:99,padding:"25px 30px",opacity:rise(f,1115)}}><Text style={{color:"white",fontSize:30,fontWeight:900}}>CONFIEZ VOS ACHATS À OLOSTO.</Text></div>
  </AbsoluteFill>}
 </AbsoluteFill>;
};
export const MainVideo = () => <Composition id="MainVideo" component={App} durationInFrames={DURATION} fps={FPS} width={1080} height={1920}/>;
registerRoot(MainVideo);