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

import "./styles.css";

export const Chat = () => {
  // const { list } = useStore($chatStore);
  const { isLogin } = useStore($accountData);
  // const [chat] = list;
  return (
    <div className="">
      <div className="wrap">
        {isLogin ? (
          <div className="chat">
            <UsersList />
            <div className="chatInner">
              <MessagesView />
              <MessageInput />
            </div>
          </div>
        ) : (
          <AddUser />
        )}
      </div>
    </div>
  );
};
