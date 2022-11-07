import React from "react";
import { useStore } from "effector-react";
import cx from "classnames";
import {
  VideoCameraIcon,
  ArrowLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { IconWrap } from "components/IconWrap";

import { CopyClipboard } from "components/CopyClipboard";
import { LoadStateStatus } from "entity/chat/consts";
import { toggleMobileUserList } from "entity/chat/store/events";
import { $chatStore } from "entity/chat/store";
import { $userStore } from "entity/user/store";

import "./styles.css";

type UsersListProps = {
  onVideoStart: (userId: string) => void;
};

export const UsersList = ({ onVideoStart }: UsersListProps) => {
  const { loadedState, chat, mobileUserListHide } = useStore($chatStore);
  const { name: currentUser } = useStore($userStore);

  if (loadedState === LoadStateStatus.notLoaded || !chat) return null;

  const onVideoChatClick = (userId: string) => () => {
    onVideoStart(userId);
  };

  const onBackBtnClick = () => {
    toggleMobileUserList();
  };

  const { users } = chat;
  return (
    <div className={cx({ showMobile: !mobileUserListHide }, "userList")}>
      <IconWrap
        classes="backToChatBtn mobileVisibleFlex"
        onClick={onBackBtnClick}
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </IconWrap>
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
            <button
              className="userActions circleBtn circleBtn-sm"
              onClick={onVideoChatClick(userId)}
            >
              <VideoCameraIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 icon" />
            </button>
          )}
        </div>
      ))}
      <CopyClipboard classes="copyBtnDesktop" isMobile={false} />
    </div>
  );
};
