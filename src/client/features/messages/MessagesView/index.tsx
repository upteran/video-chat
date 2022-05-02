import React from "react";
import { useStore } from "effector-react";

import { MessageT } from "../types";
import { $messagesList } from "../store";
import { $chatStore } from "../../chat/store";

import "./styles.css";

export const MessagesView = () => {
  const messages = useStore($messagesList);
  const { messagesInfoMap } = useStore($chatStore);
  return (
    <div className="messages">
      {messages.map(({ message, messageId, userId }: MessageT) => (
        <div
          key={messageId}
          style={{
            color: `${
              messagesInfoMap ? messagesInfoMap[userId].color : "#000"
            }`,
          }}
        >
          [{new Date().toLocaleDateString()}][
          {messagesInfoMap ? messagesInfoMap[userId].name : "name"}]:{message}
        </div>
      ))}
    </div>
  );
};
