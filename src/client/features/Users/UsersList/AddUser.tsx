import React, { useState } from "react";

import { sendUserFx } from "../store";

import "./styles.scss";

export const AddUser = () => {
  const [value, setValue] = useState("");
  const onChange = (ev: any): void => {
    const { target } = ev;
    setValue(target.value);
  };

  const onClick = async () => {
    sendUserFx(value);
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
      <button className="sendBtn" onClick={onClick}>
        Send
      </button>
    </div>
  );
};
