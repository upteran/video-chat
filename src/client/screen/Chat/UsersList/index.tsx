import React from "react";
import { useStore } from "effector-react";
import cx from "classnames";
import { UserCircleIcon } from "@heroicons/react/solid";
import { VideoCameraIcon } from "@heroicons/react/outline";

import { LoadStateStatus } from "../../../entity/chat/consts";
import { $chatStore } from "../../../entity/chat/store";
import { $userStore } from "../../../entity/user/store";

import "./styles.css";

type UsersListProps = {
  isMobileVisible: boolean;
  onVideoStart: (userId: string) => void;
};

export const UsersList = ({
  isMobileVisible = true,
  onVideoStart,
}: UsersListProps) => {
  const { loadedState, chat } = useStore($chatStore);
  const { name: currentUser } = useStore($userStore);

  if (loadedState === LoadStateStatus.notLoaded || !chat) return null;

  const onVideoChatClick = (userId: string) => () => {
    onVideoStart(userId);
  };

  const { users } = chat;
  return (
    <div className={cx({ showMobile: isMobileVisible }, "userList")}>
      {users.map(({ name, userId }) => (
        <div className="userListLine" key={userId}>
          <div className="flex items-center">
            <span className="avatar">
              <UserCircleIcon
                className={`h-7 w-7 ${
                  currentUser !== name ? "text-gray-500" : "text-blue-500"
                }`}
              />
            </span>
            {name}
          </div>
          {currentUser !== name && (
            <button className="userActions" onClick={onVideoChatClick(userId)}>
              <VideoCameraIcon className="w-6 text-gray-500 hover:text-gray-700 icon" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
