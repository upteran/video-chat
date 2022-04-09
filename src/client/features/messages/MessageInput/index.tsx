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
    <div className="flex flex-row items-center">
      <div className="basis-5/6">
        <input
          className="form-input rounded block w-full shadow-sm border-gray-300"
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
      <button className="basis-1/4 bg-teal-400 rounded" onClick={onClick}>
        Send
      </button>
    </div>
  );
};
