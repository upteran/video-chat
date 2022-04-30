import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { useStore } from "effector-react";

import { createChat, connectChat } from "../store/events";
import { $userStore } from "../../users/store";

export const AddChat: React.FC = () => {
  const { name } = useStore($userStore);
  const [chatLink, setChatLink] = useState<string>("");
  const onEnterChatClick = () => {
    if (!chatLink.length) return;
    connectChat({ userName: name, chatId: chatLink });
  };
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setChatLink(e.target.value);
  };
  const newChatClickHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    createChat({ userName: name });
  };
  return (
    <div className="addChatWrapper w-full">
      <div className="h2 mb-3.5">Enter chat link</div>
      <input
        className="input"
        type="text"
        value={chatLink}
        onChange={onInputChange}
      />
      <button className="button mt-2 mb-3.5" onClick={onEnterChatClick}>
        Enter
      </button>
      <a href="#" className="font-thin underline" onClick={newChatClickHandler}>
        or create new chat
      </a>
    </div>
  );
};
