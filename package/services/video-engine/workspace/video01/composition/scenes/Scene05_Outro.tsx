import React from "react";
import {Img,staticFile,interpolate} from "remotion";
export const Scene05_Outro=({frame}:{frame:number})=>{
 const logo=interpolate(frame,[0,18,143],[.72,1,.96],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const cta=interpolate(frame,[75,95,143],[0,1,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const ring=interpolate(frame,[0,143],[.7,1.12],{extrapolateRight:"clamp"});
 return <div style={{width:"100%",height:"100%",background:"#fff",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:260,left:130,width:820,height:820,borderRadius:"50%",border:"2px solid #00436918",transform:`scale(${ring})`}}/>
  <div style={{position:"absolute",top:355,left:225,width:630,height:630,borderRadius:"50%",border:"3px solid #DA622040",transform:`scale(${ring*.88})`}}/>
  <div style={{position:"absolute",top:450,left:325,width:430,height:430,borderRadius:70,background:"#fff",boxShadow:"0 30px 90px #00436918",display:"flex",alignItems:"center",justifyContent:"center",transform:`scale(${logo})`}}><Img src={staticFile("assets/logo.jpeg")} style={{width:315,height:315,objectFit:"contain",borderRadius:55}}/></div>
  <div style={{position:"absolute",top:1110,left:"50%",width:700,height:8,borderRadius:8,background:"#e5ebee",transform:"translateX(-50%)"}}><div style={{width:520,height:8,borderRadius:8,background:"#DA6220",transformOrigin:"left",transform:`scaleX(${cta})`}}/></div>
  <div style={{position:"absolute",top:1250,left:250,width:580,height:250,borderRadius:45,border:"2px solid #e5ebee",background:"#fff",boxShadow:"0 25px 75px #00436916",opacity:cta,transform:`translateY(${interpolate(cta,[0,1],[60,0])}px)`}}><div style={{position:"absolute",left:65,top:72,width:90,height:90,borderRadius:28,background:"#f5f8f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,color:"#004369"}}>✓</div><div style={{position:"absolute",left:205,top:75,width:260,height:16,borderRadius:8,background:"#dfe7ea"}}/><div style={{position:"absolute",left:205,top:115,width:190,height:13,borderRadius:7,background:"#edf1f2"}}/></div>
  <div style={{position:"absolute",top:1030,left:"50%",transform:"translateX(-50%)",fontSize:24,fontWeight:900,letterSpacing:6,color:"#004369",opacity:logo}}>OLOSTO</div>
  <div style={{position:"absolute",bottom:150,left:"50%",transform:"translateX(-50%)",fontSize:24,fontWeight:900,letterSpacing:4,color:"#DA6220",opacity:cta}}>SIMPLEMENT</div>
 </div>
};