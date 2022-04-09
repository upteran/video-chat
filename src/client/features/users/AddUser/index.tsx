import React, { useState } from "react";
import cx from "classnames";

import { sendUserFx } from "../store";

import "./styles.scss";

export const AddUser = () => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean | null>(null);
  const onChange = (ev: any): void => {
    const { target } = ev;
    if (target.value && error) {
      setError(false);
    }
    setValue(target.value);
  };

  const onClick = async () => {
    if (!value) {
      setError(true);
    } else {
      sendUserFx(value);
      setValue("");
      setError(null);
    }
  };

  return (
    <div className="addUser shadow-lg border-gray-200 bg-zinc-100">
      <div className="">
        <p className="font-sans">Enter your nick:</p>
      </div>
      <div className="inputWrap">
        <input
          className={cx(
            "msgInput rounded-sm border-gray-200 hover:border-gray-400",
            {
              error: error,
            },
          )}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
      <button
        className="sendBtn bg-sky-500 hover:bg-cyan-400 rounded-sm shadow-lg"
        onClick={onClick}
      >
        Send
      </button>
    </div>
  );
};
