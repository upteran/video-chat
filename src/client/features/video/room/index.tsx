import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";

import "./styles.css";

export const Room = () => {
  // const [cameras, setCameras] = useState();
  // useEffect(() => {
  //
  // }, []);
  // console.log("cameras", cameras);
  return (
    <div className="videoRoomOuter">
      <div className="videoRoomInner">
        <video id="localVideo" playsInline autoPlay muted />
      </div>
    </div>
  );
};
