import React, { useState } from "react";
import { useStore } from "effector-react";

import { XIcon } from "@heroicons/react/solid";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import { AddUser } from "./AddUser";
import { AddChat } from "./AddChat";

import { $userStore, logOutEvent } from "entity/user/store";

import "./styles.css";

export const LogIn = () => {
  const { isLogin, name } = useStore($userStore);

  const onLogOutClick = () => {
    logOutEvent();
  };

  return (
    <div className="logInWrapper">
      <div className="chatLogo icon">
        <ChatAlt2Icon className="h-12 w-12" />
      </div>
      {!isLogin ? (
        <AddUser />
      ) : (
        <>
          <button onClick={onLogOutClick} className="exitAccount">
            <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800 icon" />
          </button>
          <div className="h2 underline mb-3.5">Hi, {name}!</div>
          <AddChat />
        </>
      )}
    </div>
  );
};
