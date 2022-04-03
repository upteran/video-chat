import React from "react";

import { UsersList } from "../../features/Users/UsersList";
import { MessagesView } from "../../features/Messages/MessagesView";
import { MessageInput } from "../../features/Messages/MessageInput";

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
