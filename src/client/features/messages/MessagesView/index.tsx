import React from "react";
import { useStore } from "effector-react";

import { MessageType } from "../types";
import { $messagesList } from "../store";

import "./styles.css";

export const MessagesView = () => {
  const messages = useStore($messagesList);
  return (
    <div className="messages">
      {messages.map(({ text, messageId }: MessageType) => (
        <div key={messageId}>[timestamp][nick]:{text}</div>
      ))}
    </div>
  );
};
