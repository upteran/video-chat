import React from "react";
import { useStore } from "effector-react";

import { MessageType } from "../types";
import { $messagesList } from "../store";

import "./styles.scss";

export const MessagesView = () => {
  const messages = useStore($messagesList);
  console.log("messages", messages);
  return (
    <div className="messages basis-5/6 rounded shadow-sm border-gray-300">
      {messages.map(({ text, messageId }: MessageType) => (
        <div key={messageId}>{text}</div>
      ))}
    </div>
  );
};
