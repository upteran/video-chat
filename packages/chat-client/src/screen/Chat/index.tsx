import React from "react";

import { useStore } from "effector-react";

import { CopyClipboard } from "components/CopyClipboard";
import { IconWrap } from "components/IconWrap";
import { UserIcon } from "@heroicons/react/solid";

import { $chatStore } from "entity/chat/store";
import { toggleMobileUserList } from "entity/chat/store/events";
import { $videoChatStore, openVideoEvent } from "features/video/store";
import { Room } from "features/video";
import { UsersList } from "./UsersList";
import { MessagesView } from "./MessagesView";
import { MessageInput } from "./MessageInput";
import { ExitBtn } from "./ExitBtn";

import "./styles.css";

export const Chat = () => {
  const { chat } = useStore($chatStore);
  const { awaitConnect, isActive } = useStore($videoChatStore);

  const onVideoStart = () => {
    if (!chat?.chatId) return;
    console.log("video start");
    openVideoEvent({ chatId: chat.chatId });
  };

  const onUsersClick = () => {
    toggleMobileUserList();
  };

  return (
    <>
      <div className="chatOuter">
        {(awaitConnect || isActive) && <Room />}
        <ExitBtn />
        <div className="menuControllers">
          <IconWrap onClick={onUsersClick} classes="leftController">
            <UserIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
          </IconWrap>
          <CopyClipboard isMobile />
        </div>
        <div className="chat">
          <UsersList onVideoStart={onVideoStart} />
          <div className="chatInner">
            <MessagesView />
            <MessageInput />
          </div>
        </div>
      </div>
    </>
  );
};
