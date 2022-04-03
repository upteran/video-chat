import React from "react";

import "./styles.scss";

const list = [
  {
    id: 1,
    name: "some",
  },
  {
    id: 1,
    name: "some",
  },
  {
    id: 1,
    name: "some",
  },
];
export const UsersList = () => {
  return (
    <div className="userList">
      {list.map(({ name, id }) => (
        <div className="userListLine" key={id}>
          {name}
        </div>
      ))}
    </div>
  );
};
