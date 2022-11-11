import React, { useState } from "react";
import { useStore } from "effector-react";

import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/solid";
import { sendChatMessage } from "entity/messages/store/events";
import { toggleMobileUserList } from "entity/chat/store/events";
import { FieldInput } from "components/FieldInput";
import { $chatStore } from "entity/chat/store";
import { $userStore } from "entity/user/store";

import "./styles.css";

export const MessageInput = () => {
  const { chat } = useStore($chatStore);
  const { name } = useStore($userStore);
  const [value, setValue] = useState<string>("");
  const [msgError, setMsgError] = useState<string | null>(null);
  const onChange = (value: string): void => {
    setValue(value);
  };

  const onClick = async () => {
    if (!chat || !value) {
      setMsgError(" ");
      return;
    }
    sendChatMessage({ message: value, chatId: chat.chatId, userId: name });
    setValue("");
    setMsgError(null);
  };

  const onUsersClick = () => {
    toggleMobileUserList();
  };

  return (
    <div className="">
      <div className="sendMessageWrapper ">
        <FieldInput
          value={value}
          onChange={onChange}
          onSubmit={onClick}
          error={msgError}
        />
        <button className="sendMsgBtn" onClick={onClick}>
          <PaperAirplaneIcon className="h-6 w-6 text-blue-500" />
        </button>
      </div>
    </div>
  );
};
