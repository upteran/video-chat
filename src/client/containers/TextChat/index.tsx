import React, { useEffect, useState } from "react";
// import { parseCookies, setCookie } from "nookies";
// import { Link, Route } from "wouter";
import { useStore } from "effector-react";

import { UsersList } from "../../features/chat/UsersList";
import { MessagesView } from "../../features/messages/MessagesView";
import { MessageInput } from "../../features/messages/MessageInput";

import { $chatStore } from "../../features/chat/store";
import { removeFromChat } from "../../features/chat/store/events";
import { $userStore } from "../../features/user/store";

import { LogIn } from "../../process/logIn";

import "./styles.css";

export const Chat = () => {
  const { isLoaded, chat } = useStore($chatStore);
  const { name } = useStore($userStore);
  const onExitChat = () => {
    if (!chat?.chatId) return;
    removeFromChat({ userName: name, chatId: chat.chatId });
  };
  return (
    <div className="">
      <div className="wrap">
        {isLoaded ? (
          <div className="chatOuter">
            <div>chat link: {chat?.chatId}</div>
            <div className="chat">
              <button onClick={onExitChat} className="exitChatBtn">
                exit chat
              </button>
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
