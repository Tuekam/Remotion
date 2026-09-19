import React from "react";
import {interpolate,Easing} from "remotion";
const O="#DA6220",B="#004369",L="#e8edef";
const v=(f,a,b)=>interpolate(f,[a,a+8,b-8,b],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.out(Easing.cubic)});
export const Scene01_EuropeShop=({frame}:{frame:number})=>{
 const product=interpolate(frame,[0,18,150,166],[.8,1,1,.92],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const cursor=interpolate(frame,[10,45,70,115,150],[0,240,500,700,850],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
 const card=v(frame,35,100),q=v(frame,108,166);
 return <div style={{width:"100%",height:"100%",background:"#fff",position:"relative",overflow:"hidden",fontFamily:"Nunito"}}>
  <div style={{position:"absolute",top:140,left:55,right:55,height:700,borderRadius:40,border:`1px solid ${L}`,background:"#fff",boxShadow:"0 25px 80px #00436914",transform:`translateY(${interpolate(frame,[0,18],[100,0],{extrapolateRight:"clamp"})}px) scale(${product})`}}>
   <div style={{height:75,borderBottom:`1px solid ${L}`,display:"flex",alignItems:"center",padding:"0 25px",gap:14}}><div style={{width:20,height:20,borderRadius:6,background:B}}/><div style={{width:150,height:13,borderRadius:7,background:"#e2e8ea"}}/><div style={{marginLeft:"auto",width:65,height:12,borderRadius:6,background:"#edf1f2"}}/></div>
   <div style={{padding:25}}><div style={{height:320,borderRadius:30,background:"#f6f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:175,height:175,borderRadius:38,background:"#fff",boxShadow:"0 20px 50px #00436916",display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,color:B}}>◈</div></div><div style={{marginTop:22,height:18,width:260,borderRadius:9,background:"#dfe6e9"}}/><div style={{marginTop:12,height:12,width:150,borderRadius:6,background:"#edf1f2"}}/><div style={{marginTop:24,height:58,borderRadius:18,background:B}}/></div>
  </div>
  <div style={{position:"absolute",top:75,left:78,fontSize:24,fontWeight:900,letterSpacing:4,color:B,opacity:product}}>EUROPE</div>
  <div style={{position:"absolute",left:120+cursor,top:610,fontSize:48,color:B,transform:"rotate(-18deg)",opacity:interpolate(frame,[15,25,140,155],[0,1,1,0],{extrapolateRight:"clamp"})}}>➤</div>
  <div style={{position:"absolute",top:900,left:70,right:70,display:"flex",justifyContent:"center",gap:20,opacity:card}}>{[0,1,2].map(i=><div key={i} style={{width:245,height:250,borderRadius:30,border:`1px solid ${L}`,background:"#fff",boxShadow:"0 20px 55px #00436912",transform:`translateY(${i===1?-25:i*18}px)`}}><div style={{margin:18,height:140,borderRadius:22,background:"#f5f8f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,color:i===1?O:B}}>◈</div><div style={{height:10,width:120,margin:"0 auto",borderRadius:5,background:"#e3e9eb"}}/></div>)}</div>
  <div style={{position:"absolute",bottom:170,left:"50%",width:180,height:180,borderRadius:"50%",border:`4px solid ${O}`,transform:`translateX(-50%) scale(${.4+.6*q})`,opacity:q}}><div style={{position:"absolute",left:78,top:35,width:24,height:72,borderRadius:12,background:B}}/><div style={{position:"absolute",left:78,top:125,width:24,height:24,borderRadius:"50%",background:B}}/></div>
  <div style={{position:"absolute",bottom:105,left:"50%",transform:"translateX(-50%)",fontSize:22,fontWeight:800,letterSpacing:2,color:O,opacity:q}}>REPÉRÉ</div>
 </div>
};