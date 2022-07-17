import React, { useState } from "react";
import { useStore } from "effector-react";

import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { sendChatMessage } from "../../../entity/messages/store/events";
import { $chatStore } from "../../../entity/chat/store";
import { $userStore } from "../../../entity/user/store";

import "./styles.css";

export const MessageInput = () => {
  const { chat } = useStore($chatStore);
  const { name } = useStore($userStore);
  const [value, setValue] = useState("");
  const onChange = (ev: any): void => {
    const { target } = ev;
    setValue(target.value);
  };

  const onClick = async () => {
    if (!chat) return;
    sendChatMessage({ message: value, chatId: chat.chatId, userId: name });
    setValue("");
  };

  return (
    <div className="">
      <div className="sendMessageWrapper ">
        <input
          className="input"
          type="text"
          value={value}
          onChange={onChange}
        />
        <button className="sendMsgBtn" onClick={onClick}>
          <PaperAirplaneIcon className="h-6 w-6 text-blue-500" />
        </button>
      </div>
    </div>
  );
};
