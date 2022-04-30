import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useStore } from "effector-react";

import { createChat, connectChat } from "../store/events";
import { $userStore } from "../../user/store";
import { parseCookies } from "nookies";

export const AddChat: React.FC = () => {
  const { name } = useStore($userStore);
  const [chatLink, setChatLink] = useState<string>("");

  useEffect(() => {
    // TODO: change reconnect logic after
    const cookie = parseCookies();
    if (cookie?.chatToken && cookie?.chatUser) {
      connectChat({ userName: cookie?.chatUser, chatId: cookie?.chatToken });
    }
  }, []);

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
