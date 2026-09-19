import React from "react";
import {AbsoluteFill, Audio, Composition, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {registerRoot} from "remotion";

const FPS=30;
const DURATION=Math.ceil(35.683*FPS);

const A="/assets/";
const blue="#004369", orange="#DA6220", white="#FFFFFF", pale="#EEF6FA";

function Fade({children,from,dur=18}){const f=useCurrentFrame(); const op=interpolate(f,[from,from+dur],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}); return <div style={{opacity:op}}>{children}</div>}
function Ken({src,from,to,scale=1.08,children}){const f=useCurrentFrame(); const p=interpolate(f,[from,to],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}); const s=interpolate(p,[0,1],[1,scale]); return <AbsoluteFill><Img src={staticFile(src)} style={{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${s})`}}/>{children}</AbsoluteFill>}
function Text({children,size=90,color=blue,weight=800,style={}}){return <div style={{fontFamily:"Nunito",fontSize:size,fontWeight:weight,color,lineHeight:.96,letterSpacing:-2,...style}}>{children}</div>}
function MainVideo(){
 const f=useCurrentFrame(); const t=f/FPS;
 const zoom=interpolate(t,[0,35.683],[1,1.04],{extrapolateRight:"clamp"});
 const pulse=spring({frame:f,fps:FPS,config:{damping:14,stiffness:90}});
 return <AbsoluteFill style={{backgroundColor:white,fontFamily:"Nunito",overflow:"hidden"}}>
   <style>{`
   @font-face{font-family:Nunito;src:url(${staticFile("fonts/Nunito/Nunito-Regular.ttf")}) format("truetype");font-weight:400}
   @font-face{font-family:Nunito;src:url(${staticFile("fonts/Nunito/Nunito-Bold.ttf")}) format("truetype");font-weight:700 900}
   @font-face{font-family:Luckybones;src:url(${staticFile("fonts/Luckybones/Luckybones-Bold.otf")}) format("opentype");font-weight:700}
   `}</style>
   <Audio src={staticFile("audio/voice-over.mp3")} volume={1}/>
   <Audio src={staticFile("assets/background.mp3")} volume={0.16}/>
   {t<2.95 && <Ken src="assets/product-hero.jpg" from={0} to={2.95} scale={1.10}>
      <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.62))"}}/>
      <div style={{position:"absolute",left:70,right:70,bottom:170}}>
        <Fade from={4}><Text size={112} color={white}>VOUS AVEZ<br/>TROUVÉ <span style={{color:orange}}>LE PRODUIT.</span></Text></Fade>
      </div>
   </Ken>}
   {t>=2.95 && t<7.52 && <Ken src="assets/ecommerce-product.jpg" from={2.95*FPS} to={7.52*FPS} scale={1.07}>
      <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.72) 43%,rgba(255,255,255,.05) 100%)"}}/>
      <div style={{position:"absolute",left:68,top:220,width:760}}>
        <Text size={86}>ACHETER EN EUROPE,<br/><span style={{color:orange}}>DEPUIS LE CAMEROUN.</span></Text>
        <div style={{marginTop:45,padding:"22px 28px",background:"rgba(255,255,255,.88)",border:"1px solid #D7E7EE",borderRadius:22,width:650}}>
          <Text size={32} color="#46606D" weight={700}>PAIEMENT  •  ADRESSE  •  EXPÉDITION</Text>
        </div>
      </div>
   </Ken>}
   {t>=7.52 && t<13.84 && <AbsoluteFill style={{backgroundColor:pale}}>
      <div style={{position:"absolute",inset:0,opacity:.18,backgroundImage:"radial-gradient(circle at 70% 35%,#004369 0 2px,transparent 3px)",backgroundSize:"46px 46px"}}/>
      <div style={{position:"absolute",left:65,right:65,top:240}}>
        <Fade from={7.52*FPS}><Text size={76} color="#5C7280">AVEC</Text></Fade>
        <Fade from={7.8*FPS}><Img src={staticFile("assets/logo.jpeg")} style={{width:430,height:"auto",marginTop:24}}/></Fade>
        <Fade from={8.2*FPS}><Text size={88} style={{marginTop:55}}>VOTRE FACILITATEUR<br/><span style={{color:orange}}>D'ACHAT.</span></Text></Fade>
      </div>
      <div style={{position:"absolute",left:70,right:70,bottom:150,height:8,background:blue,borderRadius:8,transformOrigin:"left",transform:`scaleX(${Math.min(1,Math.max(0,(t-8.4)/2.5))})`}}/>
   </AbsoluteFill>}
   {t>=13.84 && t<19.36 && <AbsoluteFill style={{background:white}}>
      <div style={{position:"absolute",left:60,right:60,top:170}}>
        <Text size={42} color={orange}>ÉTAPE 01</Text>
        <Text size={90} style={{marginTop:22}}>VOUS<br/>CHOISISSEZ.</Text>
        <div style={{marginTop:55,background:pale,borderRadius:30,padding:24,boxShadow:"0 24px 60px rgba(0,67,105,.12)"}}>
          <Img src={staticFile("assets/ecommerce-product.jpg")} style={{width:"100%",height:690,objectFit:"cover",borderRadius:22}}/>
        </div>
        <Text size={34} color="#58707C" weight={700} style={{marginTop:28}}>Votre produit sur votre site européen préféré.</Text>
      </div>
   </AbsoluteFill>}
   {t>=19.36 && t<25.46 && <AbsoluteFill style={{background:blue}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 25%,rgba(218,98,32,.38),transparent 32%)"}}/>
      <div style={{position:"absolute",left:65,right:65,top:240}}>
        <Text size={44} color={orange}>ÉTAPE 02</Text>
        <Text size={86} color={white} style={{marginTop:20}}>OLOSTO<br/>PREND LE RELAIS.</Text>
        <div style={{marginTop:55,padding:30,border:"1px solid rgba(255,255,255,.25)",borderRadius:28}}>
          <Img src={staticFile("assets/logo.jpeg")} style={{width:360,height:"auto",filter:"brightness(0) invert(1)"}}/>
          <Text size={36} color={white} weight={700} style={{marginTop:35}}>Nous facilitons votre achat.</Text>
        </div>
      </div>
   </AbsoluteFill>}
   {t>=25.46 && t<29.12 && <Ken src="assets/europe-cameroon.jpg" from={25.46*FPS} to={29.12*FPS} scale={1.09}>
      <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,67,105,.72))"}}/>
      <div style={{position:"absolute",left:60,right:60,bottom:160}}>
        <Text size={52} color={orange}>ÉTAPE 03</Text>
        <Text size={100} color={white} style={{marginTop:20}}>VOTRE COLIS<br/>VOYAGE.</Text>
        <div style={{height:5,background:orange,width:"80%",marginTop:38}}/>
        <Text size={34} color={white} weight={700} style={{marginTop:25}}>EUROPE  →  CAMEROUN</Text>
      </div>
   </Ken>}
   {t>=29.12 && t<33.12 && <Ken src="assets/cameroon-arrival.jpg" from={29.12*FPS} to={33.12*FPS} scale={1.06}>
      <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,67,105,.05),rgba(0,67,105,.7))"}}/>
      <div style={{position:"absolute",left:60,right:60,bottom:170}}>
        <Text size={72} color={white}>ACHETEZ EN EUROPE.</Text>
        <Text size={72} color={white} style={{marginTop:20}}>NOUS NOUS OCCUPONS<br/><span style={{color:orange}}>DU RESTE.</span></Text>
      </div>
   </Ken>}
   {t>=33.12 && <AbsoluteFill style={{background:white}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 20%,#EEF6FA,white 58%)"}}/>
      <div style={{position:"absolute",left:60,right:60,top:270,textAlign:"center",transform:`translateY(${(1-pulse)*20}px)`}}>
        <Img src={staticFile("assets/logo.jpeg")} style={{width:420,height:"auto"}}/>
        <Text size={66} style={{marginTop:65}}>VOS ACHATS EUROPÉENS.<br/><span style={{color:orange}}>PLUS SIMPLES.</span></Text>
        <Text size={42} color="#5C7280" weight={700} style={{marginTop:35}}>AVEC OLOSTO.</Text>
        <div style={{margin:"75px auto 0",background:orange,color:white,padding:"26px 38px",borderRadius:18,width:760,fontSize:38,fontWeight:800}}>Confiez vos achats à OLOSTO.</div>
      </div>
   </AbsoluteFill>}
 </AbsoluteFill>
}
function Root(){return <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920}/>}
registerRoot(Root);
