import React from "react";

import { UsersList } from "./UsersList";
import { MessagesView } from "./MessagesView";
import { MessageInput } from "./MessageInput";

import "./styles.scss";

export const Chat = () => {
  return (
    <div>
      <div className="chat">
        <UsersList />
        <MessagesView />
      </div>
      <MessageInput />
    </div>
  );
};
