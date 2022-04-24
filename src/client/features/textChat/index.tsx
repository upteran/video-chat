import React, { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Link, Route } from "wouter";
import { useStore } from "effector-react";

import { UsersList } from "../users/UsersList";
import { MessagesView } from "../messages/MessagesView";
import { MessageInput } from "../messages/MessageInput";

import { $chatStore } from "./store";

import "./styles.css";
import { LogIn } from "../../process/logIn";

export const Chat = () => {
  const { isLoaded, chat } = useStore($chatStore);

  return (
    <div className="">
      <div className="wrap">
        {isLoaded ? (
          <div className="chatOuter">
            <div>chat link: {chat?.chatId}</div>
            <div className="chat">
              <UsersList />
              <div className="chatInner">
                <MessagesView />
                <MessageInput />
              </div>
            </div>
          </div>
        ) : (
          <LogIn />
        )}
      </div>
    </div>
  );
};
