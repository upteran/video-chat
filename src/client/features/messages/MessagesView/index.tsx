import React from "react";
import { useStore } from "effector-react";

import { MessageT } from "../types";
import { $messagesList } from "../store";

import "./styles.css";

export const MessagesView = () => {
  const messages = useStore($messagesList);
  return (
    <div className="messages">
      {messages.map(({ message, messageId }: MessageT) => (
        <div key={messageId}>[timestamp][nick]:{message}</div>
      ))}
    </div>
  );
};
