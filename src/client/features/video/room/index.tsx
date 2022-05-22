import React, { useEffect, useRef, useState } from "react";
import { useStore } from "effector-react";
import { sendPeerOffer, $videoChatStore, sendPeerAnswer } from "../store";
import { initServiceOnVideoStart } from "../services";

import "./styles.css";

export const Room = () => {
  const [send, setSend] = useState(false);
  const local = useRef(null);
  const remote = useRef(null);
  const { chatId, offer, isHost, isActive } = useStore($videoChatStore);
  useEffect(() => {
    if (local.current && remote.current) {
      console.log("init");
      initServiceOnVideoStart(local.current, remote.current);
      if (isHost && chatId && !send) {
        sendPeerOffer({
          chatId,
        });
        setSend(true);
      }
    }
  }, [local.current, remote.current]);

  const onAnswerCall = () => {
    sendPeerAnswer({
      chatId,
      offer,
    });
  };

  return (
    <div className="videoRoomOuter">
      <div className="videoRoomInner">
        {offer && !isActive && (
          <div className="incomingCall">
            <p>Incoming call</p>
            <button onClick={onAnswerCall}>Call</button>
          </div>
        )}
        <video ref={remote} id="remoteVideo" playsInline autoPlay muted />
        <video ref={local} id="localVideo" playsInline autoPlay muted />
      </div>
    </div>
  );
};
