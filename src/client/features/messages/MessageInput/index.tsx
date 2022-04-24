import React, { useState } from "react";
import { useStore } from "effector-react";

import { sendChatMessage } from "../store/events";
import { $chatStore } from "../../chat/store";

import "./styles.css";

export const MessageInput = () => {
  const { chat } = useStore($chatStore);
  const [value, setValue] = useState("");
  const onChange = (ev: any): void => {
    const { target } = ev;
    setValue(target.value);
  };

  const onClick = async () => {
    if (!chat) return;
    sendChatMessage({ msg: value, chatId: chat.chatId });
    setValue("");
  };

  return (
    <div className="">
      <div className="sendMessageWrapper ">
        <input
          className="msgInputText"
          type="text"
          value={value}
          onChange={onChange}
        />
        <button className="sendMsgBtn" onClick={onClick}>
          Send
        </button>
      </div>
    </div>
  );
};
