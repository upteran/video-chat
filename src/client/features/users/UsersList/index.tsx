import React from "react";
import { useStore } from "effector-react";

import { AddUser } from "../AddUser";
import { UserType } from "../types";
import { $userList } from "../store";

import "./styles.css";

export const UsersList = () => {
  const users = useStore($userList);
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
