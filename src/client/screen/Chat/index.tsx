import React, { useEffect, useState } from "react";
// import { parseCookies, setCookie } from "nookies";
// import { Link, Route } from "wouter";
import { useStore } from "effector-react";

import { UsersList } from "../../features/chat/UsersList";
import { MessagesView } from "../../features/messages/MessagesView";
import { MessageInput } from "../../features/messages/MessageInput";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { XIcon, UserIcon } from "@heroicons/react/solid";

import { $chatStore } from "../../features/chat/store";
import { removeFromChat } from "../../features/chat/store/events";
import { $userStore } from "../../features/user/store";
import { $videoChatStore, openVideoEvent } from "../../features/video/store";

import "./styles.css";
import { Room } from "../../features/video";

export const Chat = () => {
  const { chat } = useStore($chatStore);
  const { awaitConnect, isActive } = useStore($videoChatStore);
  const { name } = useStore($userStore);
  const [mobileVisible, setMobileVisible] = useState(false);

  const onVideoStart = () => {
    if (!chat?.chatId) return;
    console.log("video start");
    openVideoEvent({ chatId: chat.chatId });
  };
  const onExitChat = () => {
    if (!chat?.chatId) return;
    removeFromChat({ userName: name, chatId: chat.chatId });
  };
  const onUsersClick = () => {
    setMobileVisible(!mobileVisible);
  };
  const onCopyClick = async () => {
    try {
      // @ts-ignore
      await navigator.clipboard.writeText(chat?.chatId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="chatOuter">
        {/*{(awaitConnect || isActive) && <Room />}*/}
        <Room />
        <div className="chatHeader">
          <div className="chatLink">
            {/*<p>Chat link: {chat?.chatId}</p>*/}
            <button className="usersListBtn circleBtn" onClick={onUsersClick}>
              <UserIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
            </button>
            <button className="copyBtn circleBtn" onClick={onCopyClick}>
              <ClipboardCopyIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
            </button>
          </div>
          <button onClick={onExitChat}>
            <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
          </button>
        </div>
        <div className="chat">
          <UsersList
            isMobileVisible={mobileVisible}
            onVideoStart={onVideoStart}
          />
          <div className="chatInner">
            <MessagesView />
            <MessageInput />
          </div>
        </div>
      </div>
    </>
  );
};
