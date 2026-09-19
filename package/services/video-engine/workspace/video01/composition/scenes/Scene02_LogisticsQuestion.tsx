import React from "react";
import {interpolate,Easing} from "remotion";
const O="#DA6220",B="#004369",L="#e5ebee";
export const Scene02_LogisticsQuestion=({frame}:{frame:number})=>{
 const cards=interpolate(frame,[0,18],[0,1],{extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
 const move=interpolate(frame,[18,55,100],[0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
 const lock=interpolate(frame,[45,70,100],[0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <div style={{width:"100%",height:"100%",background:"#fff",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:160,left:"50%",transform:"translateX(-50%)",fontSize:28,fontWeight:900,letterSpacing:5,color:B,opacity:cards}}>EUROPE → CAMEROUN</div>
  <div style={{position:"absolute",top:280,left:70,right:70,height:520,borderRadius:48,border:`2px solid ${L}`,boxShadow:"0 30px 90px #00436912",background:"#fff",transform:`scale(${.9+.1*cards})`}}>
   <div style={{position:"absolute",left:80,top:155,width:250,height:190,borderRadius:32,background:"#f7f9fa",display:"flex",alignItems:"center",justifyContent:"center",transform:`translateX(${interpolate(move,[0,1],[0,110])}px)`}}><div style={{width:105,height:105,borderRadius:28,background:B,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:900}}>€</div></div>
   <div style={{position:"absolute",right:80,top:155,width:250,height:190,borderRadius:32,background:"#f7f9fa",display:"flex",alignItems:"center",justifyContent:"center",transform:`translateX(${interpolate(move,[0,1],[0,-110])}px)`}}><div style={{width:105,height:105,borderRadius:28,background:O,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,fontWeight:900}}>CM</div></div>
   <div style={{position:"absolute",left:330,top:245,width:270,height:9,borderRadius:8,background:L}}/><div style={{position:"absolute",left:330,top:245,width:270,height:9,borderRadius:8,background:O,transformOrigin:"left",transform:`scaleX(${move})`}}/>
   <div style={{position:"absolute",left:450,top:200,width:80,height:70,borderRadius:18,background:"#fff",border:`2px solid ${L}`,boxShadow:"0 12px 35px #00436918",transform:`translateX(${interpolate(move,[0,1],[0,120])}px)`}}/>
  </div>
  <div style={{position:"absolute",top:930,left:"50%",width:330,height:330,borderRadius:"50%",border:`4px solid ${O}`,transform:`translateX(-50%) scale(${.7+.3*lock}) rotate(${interpolate(frame,[50,100],[0,180],{extrapolateRight:"clamp"})}deg)`,opacity:.18}}><div style={{position:"absolute",left:150,top:30,width:25,height:270,borderRadius:12,background:B}}/><div style={{position:"absolute",left:30,top:150,width:270,height:25,borderRadius:12,background:B}}/></div>
  <div style={{position:"absolute",left:"50%",top:1120,width:250,height:170,borderRadius:30,background:"#fff",border:`2px solid ${L}`,boxShadow:"0 20px 60px #00436916",transform:`translateX(-50%) scale(${lock})`,opacity:lock}}><div style={{position:"absolute",left:104,top:70,width:42,height:48,borderRadius:12,background:O}}/><div style={{position:"absolute",left:110,top:35,width:30,height:50,border:`6px solid ${B}`,borderBottom:0,borderRadius:"20px 20px 0 0"}}/></div>
  <div style={{position:"absolute",top:1370,left:"50%",transform:"translateX(-50%)",fontSize:24,fontWeight:900,letterSpacing:4,color:O,opacity:lock}}>BARRIÈRE LOGISTIQUE</div>
 </div>
};