import React from "react";
import {Img,staticFile,interpolate} from "remotion";
const O="#DA6220",B="#004369",L="#e5ebee";
export const Scene03_OlostOUnlock=({frame}:{frame:number})=>{
 const logo=interpolate(frame,[0,18,103],[.7,1,.92],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const rays=interpolate(frame,[0,25,90,103],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const ui=interpolate(frame,[35,60,103],[0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <div style={{width:"100%",height:"100%",background:"#fff",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:220,left:"50%",transform:"translateX(-50%)",fontSize:28,fontWeight:900,letterSpacing:7,color:B,opacity:logo}}>OLOSTO</div>
  {[0,1,2,3,4,5,6,7].map(i=><div key={i} style={{position:"absolute",left:"50%",top:790,width:430,height:5,borderRadius:5,background:O,transformOrigin:"0 50%",transform:`rotate(${i*45}deg) scaleX(${rays})`,opacity:.55}}/>)}
  <div style={{position:"absolute",top:360,left:170,width:740,height:740,borderRadius:"50%",border:`2px solid ${L}`,transform:`scale(${logo})`}}><div style={{position:"absolute",inset:72,borderRadius:"50%",border:"2px solid #DA622030"}}/><div style={{position:"absolute",inset:145,borderRadius:54,background:"#fff",boxShadow:"0 35px 95px #00436920",display:"flex",alignItems:"center",justifyContent:"center"}}><Img src={staticFile("assets/logo.jpeg")} style={{width:330,height:330,objectFit:"contain",borderRadius:65}}/></div></div>
  <div style={{position:"absolute",top:1230,left:120,right:120,height:250,borderRadius:42,border:`2px solid ${L}`,background:"#fff",boxShadow:"0 22px 70px #00436914",opacity:ui,transform:`translateY(${interpolate(ui,[0,1],[80,0])}px)`}}>
   <div style={{position:"absolute",left:55,top:65,width:90,height:90,borderRadius:25,background:B}}/><div style={{position:"absolute",left:175,top:75,width:370,height:18,borderRadius:9,background:"#dfe7ea"}}/><div style={{position:"absolute",left:175,top:118,width:270,height:13,borderRadius:7,background:"#edf1f2"}}/><div style={{position:"absolute",right:45,top:55,width:110,height:110,borderRadius:32,background:O,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,color:"#fff"}}>✓</div>
  </div>
  <div style={{position:"absolute",top:1520,left:"50%",transform:"translateX(-50%)",fontSize:24,fontWeight:900,letterSpacing:5,color:O,opacity:ui}}>ACHAT FACILITÉ</div>
 </div>
};