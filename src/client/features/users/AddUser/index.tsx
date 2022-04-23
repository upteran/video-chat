import React, { useState } from "react";
import cx from "classnames";

import { createChat } from "../../textChat/store";

import "./styles.css";

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
      createChat({ userName: value });
      setValue("");
      setError(null);
    }
  };

  return (
    <>
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
        className="group relative w-full flex justify-center align-middle py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2.5 mt-3.5"
        onClick={onClick}
      >
        Send
      </button>
    </>
  );
};
