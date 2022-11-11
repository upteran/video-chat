import React, { useState } from "react";

import { FieldInput } from "components/FieldInput";
import { createUserEvent } from "entity/user/store";

import "./styles.css";

export const AddUser = () => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const onChange = (text: string): void => {
    if (text && error) {
      setError(null);
    }
    setValue(text);
  };

  const onClick = async () => {
    if (!value) {
      setError("Enter your nick");
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
        <FieldInput
          onSubmit={onClick}
          onChange={onChange}
          value={value}
          error={error}
        />
      </div>
      <button className="button" onClick={onClick}>
        Send
      </button>
    </>
  );
};
