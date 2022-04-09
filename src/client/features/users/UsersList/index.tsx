import React from "react";
import { useStore } from "effector-react";

import { AddUser } from "../AddUser";
import { UserType } from "../types";
import { $userList } from "../store";

import "./styles.scss";

export const UsersList = () => {
  const users = useStore($userList);
  return (
    <div className="userList basis-1/4 border-gray-300">
      {users.map(({ name, userId }: UserType) => (
        <div className="userListLine" key={userId}>
          {name}
        </div>
      ))}
    </div>
  );
};
