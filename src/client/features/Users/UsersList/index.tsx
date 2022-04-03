import React from "react";
import { useStore } from "effector-react";

import { AddUser } from "./AddUser";
import { UserType } from "../types";
import { $userList } from "../store";

import "./styles.scss";

export const UsersList = () => {
  const users = useStore($userList);
  return (
    <div className="userList">
      {users.map(({ name, userId }: UserType) => (
        <div className="userListLine" key={userId}>
          {name}
        </div>
      ))}
      <AddUser />
    </div>
  );
};
