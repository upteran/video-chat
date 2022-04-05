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
    <div className="addUser shadow-lg border-gray-200 bg-zinc-100">
      <div className="">
        <p className="font-sans">Enter your nick:</p>
      </div>
      <input
        className="msgInput rounded-sm border-gray-200 hover:border-gray-400"
        type="text"
        value={value}
        onChange={onChange}
      />
      <button
        className="sendBtn bg-sky-500 hover:bg-cyan-400 rounded-sm shadow-lg"
        onClick={onClick}
      >
        Send
      </button>
    </div>
  );
};
