import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import cx from "classnames";

import { Message } from "entity/messages/types";
import { $messagesList } from "entity/messages/store";
import { $chatStore } from "entity/chat/store";
import { $userStore } from "entity/user/store";

import "./styles.css";

export const MessagesView = () => {
  const cont = useRef(null);
  const messages = useStore($messagesList);
  const { messagesInfoMap } = useStore($chatStore);
  const { name } = useStore($userStore);
  const userMap = messagesInfoMap || {};
  useEffect(() => {
    if (cont?.current !== null) {
      // @ts-ignore
      cont.current.scrollTop = cont.current.scrollHeight;
    }
  }, [messages.length]);
  return (
    <div className="messages" ref={cont}>
      {messages.map(({ message, messageId, userId }: Message) => (
        <div
          key={messageId}
          className={cx("message", {
            mainUser: name === userMap[userId].name,
          })}
        >
          <div className="messageUserName">
            {userMap[userId]?.name || "name"}:{" "}
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          {message}
        </div>
      ))}
    </div>
  );
};
