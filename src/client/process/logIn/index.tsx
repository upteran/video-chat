import React, { useState } from "react";
import { useStore } from "effector-react";

import { XIcon } from "@heroicons/react/solid";
import { AddUser } from "../../features/user/AddUser";
import { AddChat } from "../../features/chat/AddChat";

import { $userStore, logOutEvent } from "../../features/user/store";

import "./styles.css";

export const LogIn = () => {
  const { isLogin, name } = useStore($userStore);

  const onLogOutClick = () => {
    logOutEvent();
  };

  return (
    <div className="logInWrapper">
      {!isLogin ? (
        <AddUser />
      ) : (
        <>
          <button onClick={onLogOutClick} className="exitAccount">
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
          <div className="h2 underline mb-3.5">Hi, {name}!</div>
          <AddChat />
        </>
      )}
    </div>
  );
};
