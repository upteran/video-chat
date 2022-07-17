import React, { useState } from "react";
import cx from "classnames";

import { createUserEvent } from "../../../entity/user/store";

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
      createUserEvent(value);
      setValue("");
      setError(null);
    }
  };

  return (
    <>
      <div className="">
        <p className="h2 mb-3.5">Enter your nick:</p>
      </div>
      <div className="inputWrap mb-2">
        <input
          className={cx("input", {
            error: error,
          })}
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
      <button className="button" onClick={onClick}>
        Send
      </button>
    </>
  );
};
