import React, { useState } from "react";

import { sendChatMessage } from "../store";

import "./styles.css";

export const MessageInput = () => {
  const [value, setValue] = useState("");
  const onChange = (ev: any): void => {
    const { target } = ev;
    setValue(target.value);
  };

  const onClick = async () => {
    sendChatMessage(value);
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
