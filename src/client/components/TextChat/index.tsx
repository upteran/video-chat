import React, { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Link, Route } from "wouter";
import { useStore } from "effector-react";

import { UsersList } from "../../features/users/UsersList";
import { AddUser } from "../../features/users/AddUser";
import { MessagesView } from "../../features/messages/MessagesView";
import { MessageInput } from "../../features/messages/MessageInput";

import { $accountData } from "../../features/users/store";

import "./styles.scss";

export const Chat = () => {
  const { isLogin } = useStore($accountData);
  return (
    <div>
      {isLogin ? (
        <div className="chat">
          <div className="chatInner">
            <MessagesView />
            <UsersList />
          </div>
          <MessageInput />
        </div>
      ) : (
        <AddUser />
      )}
    </div>
  );
};
