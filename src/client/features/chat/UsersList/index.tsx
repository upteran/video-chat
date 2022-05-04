import React from "react";
import { useStore } from "effector-react";
import cx from "classnames";

import { $chatStore } from "../store";
import { ChatStateType } from "../types";

import "./styles.css";

interface UsersListT {
  isMobileVisible: boolean;
}

export const UsersList = ({ isMobileVisible = true }: UsersListT) => {
  const { isLoaded, chat } = useStore<ChatStateType>($chatStore);

  if (!isLoaded || !chat) return null;

  const { users } = chat;
  return (
    <div className={cx({ showMobile: isMobileVisible }, "userList")}>
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
