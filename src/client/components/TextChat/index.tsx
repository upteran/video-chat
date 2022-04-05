import React, { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

import { UsersList } from "../../features/Users/UsersList";
import { AddUser } from "../../features/Users/AddUser";
import { MessagesView } from "../../features/Messages/MessagesView";
import { MessageInput } from "../../features/Messages/MessageInput";

import "./styles.scss";

export const Chat = () => {
  const token = false;
  return (
    <div>
      {token ? (
        <div className="chat">
          <div>
            <UsersList />
            <MessagesView />
          </div>
          <MessageInput />
        </div>
      ) : (
        <AddUser />
      )}
    </div>
  );
};
