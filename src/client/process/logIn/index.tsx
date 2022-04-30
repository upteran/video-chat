import React, { useState } from "react";
import cx from "classnames";

import { AddUser } from "../../features/users/AddUser";
import { AddChat } from "../../features/chat/AddChat";

import "./styles.css";
import { useStore } from "effector-react";
import { $userStore } from "../../features/users/store";

export const LogIn = () => {
  const { isLogin, name } = useStore($userStore);
  return (
    <div className="logInWrapper">
      {!isLogin ? (
        <AddUser />
      ) : (
        <>
          <div className="h2 underline mb-3.5">Hi, {name}!</div>
          <AddChat />
        </>
      )}
    </div>
  );
};
