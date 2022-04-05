import React, { useState } from "react";

import { sendUserMessageFx } from "../store";

import "./styles.scss";

export const MessageInput = () => {
  const [value, setValue] = useState("");
  const onChange = (ev: any): void => {
    const { target } = ev;
    setValue(target.value);
  };

  const onClick = async () => {
    sendUserMessageFx(value);
    setValue("");
  };

  return (
    <div>
      <input
        className="msgInput"
        type="text"
        value={value}
        onChange={onChange}
      />
      <button className="sendMsgBtn" onClick={onClick}>
        Send
      </button>
    </div>
  );
};
