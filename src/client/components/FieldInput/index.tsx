import React from "react";
import cx from "classnames";

type FieldInputProps = {
  error: boolean | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const FieldInput = ({
  error,
  value,
  onChange,
  onSubmit,
}: FieldInputProps) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChange && onChange(text);
  };
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      onSubmit && onSubmit();
    }
  };
  return (
    <input
      className={cx("input", {
        error: error,
      })}
      type="text"
      value={value}
      onKeyPress={onKeyPress}
      onChange={onChangeHandler}
    />
  );
};
