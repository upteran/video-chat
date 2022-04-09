import React, { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Link, Route } from "wouter";
import { useStore } from "effector-react";

import { UsersList } from "../../users/UsersList";
import { AddUser } from "../../users/AddUser";
import { MessagesView } from "../../messages/MessagesView";
import { MessageInput } from "../../messages/MessageInput";

import { $accountData } from "../../users/store";
import { $chatStore } from "../store";

import "./styles.scss";

export const Chat = () => {
  // const { list } = useStore($chatStore);
  const { isLogin } = useStore($accountData);
  // const [chat] = list;
  return (
    <div>
      {isLogin ? (
        <div className="chat">
          <div className="chatInner flex flex-row">
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
