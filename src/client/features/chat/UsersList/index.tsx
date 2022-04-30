import React from "react";
import { useStore } from "effector-react";

import "./styles.css";
import { $chatStore } from "../store";
import { ChatStateType } from "../types";

export const UsersList = () => {
  const { isLoaded, chat } = useStore<ChatStateType>($chatStore);

  if (!isLoaded || !chat) return null;

  const { users } = chat;
  return (
    <div className="userList">
      {users.map(({ name, userId }) => (
        <div className="userListLine" key={userId}>
          <span className="avatar">
            <img src="" alt="" />
          </span>
          {name}
        </div>
      ))}
    </div>
  );
};
