import React from "react";
import {Audio, Composition, Sequence, staticFile, AbsoluteFill, useCurrentFrame} from "remotion";
import {registerRoot} from "remotion";
import {Scene01_EuropeShop} from "./scenes/Scene01_EuropeShop";
import {Scene02_LogisticsQuestion} from "./scenes/Scene02_LogisticsQuestion";
import {Scene03_OlostOUnlock} from "./scenes/Scene03_OlostOUnlock";
import {Scene04_Journey} from "./scenes/Scene04_Journey";
import {Scene05_Outro} from "./scenes/Scene05_Outro";

export const FPS=30;
export const DURATION=1078;
export const W=1080;
export const H=1920;

// Timings are anchored to the verified ElevenLabs word timestamps.
const S1=0, S2=166, S3=248, S4=351, S5=934;

export const MainVideo=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:"#fff"}}>
  <Sequence from={S1} durationInFrames={S2-S1}><Scene01_EuropeShop frame={frame-S1}/></Sequence>
  <Sequence from={S2} durationInFrames={S3-S2}><Scene02_LogisticsQuestion frame={frame-S2}/></Sequence>
  <Sequence from={S3} durationInFrames={S4-S3}><Scene03_OlostOUnlock frame={frame-S3}/></Sequence>
  <Sequence from={S4} durationInFrames={S5-S4}><Scene04_Journey frame={frame-S4}/></Sequence>
  <Sequence from={S5} durationInFrames={DURATION-S5}><Scene05_Outro frame={frame-S5}/></Sequence>
  <Audio src={staticFile("audio/voice-over.mp3")} volume={1}/>
  <Audio src={staticFile("assets/background.mp3")} volume={0.10}/>
 </AbsoluteFill>;
};

export default function Root(){
 return <>
  <style>{`
   @font-face{font-family:Nunito;src:url(${staticFile("fonts/Nunito/Nunito-Regular.ttf")})}
   @font-face{font-family:Nunito;src:url(${staticFile("fonts/Nunito/Nunito-Bold.ttf")});font-weight:800}
   @font-face{font-family:Luckybones;src:url(${staticFile("fonts/Luckybones/Luckybones-Bold.otf")});font-weight:900}
  `}</style>
  <Composition id="MainVideo" component={MainVideo} durationInFrames={DURATION} fps={FPS} width={W} height={H}/>
 </>
}

registerRoot(Root);