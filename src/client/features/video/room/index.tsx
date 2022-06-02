import React, { useEffect, useRef, useState } from "react";
import { useStore } from "effector-react";
import { XIcon } from "@heroicons/react/solid";

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
      <button className="videoClose">
        <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
      </button>
      <div className="videoRoomInner">
        {offer && !isActive && (
          <div className="incomingCall">
            <div className="w-2/3 text-center">
              <p className="text-gray-50">Incoming call</p>
              <button className="button mt-2 mt-3.5" onClick={onAnswerCall}>
                Call
              </button>
            </div>
          </div>
        )}
        <div className="remoteVWrapper">
          <video ref={remote} id="remoteVideo" playsInline autoPlay muted />
        </div>
        <div className="localVWrapper">
          <video ref={local} id="localVideo" playsInline autoPlay muted />
        </div>
      </div>
    </div>
  );
};
