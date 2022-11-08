import React from "react";
import { useStore } from "effector-react";

import { XIcon } from "@heroicons/react/solid";

import { IconWrap } from "components/IconWrap";
import { removeFromChat } from "entity/chat/store/events";
import { $chatStore } from "entity/chat/store";
import { $userStore, logOutEvent } from "entity/user/store";

import "./styles.css";

export const ExitBtn = () => {
  const { chat } = useStore($chatStore);
  const { name } = useStore($userStore);
  const onExitChat = () => {
    if (!chat?.chatId) return;
    removeFromChat({ userName: name, chatId: chat.chatId });
    logOutEvent();
  };
  return (
    <IconWrap onClick={onExitChat} classes="btnExit" onlyMobile={false}>
      <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
    </IconWrap>
  );
};
