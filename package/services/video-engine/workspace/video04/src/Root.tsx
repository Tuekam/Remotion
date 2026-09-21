import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainVideo} from "../composition/MainVideo";

const Root=()=> <Composition id="MainVideo" component={MainVideo} durationInFrames={660} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
