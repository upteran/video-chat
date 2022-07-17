import React from "react";
import { useStore } from "effector-react";

import { Message } from "entity/messages/types";
import { $messagesList } from "entity/messages/store";
import { $chatStore } from "entity/chat/store";

import "./styles.css";

export const MessagesView = () => {
  const messages = useStore($messagesList);
  const { messagesInfoMap } = useStore($chatStore);
  return (
    <div className="messages">
      {messages.map(({ message, messageId, userId }: Message) => (
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
