import React, { MouseEventHandler, useEffect, useState } from "react";
import { useStore } from "effector-react";
import { parseCookies } from "nookies";

import { FieldInput } from "components/FieldInput";
import { Spinner } from "components/Spinner";
import {
  connectChat,
  createChat,
} from "entity/chat/store/events";
import { $userStore } from "entity/user/store";
import { $chatStore } from "entity/chat/store";
import { LoadStateStatus } from "entity/chat/consts";

export const AddChat = () => {
  const { name } = useStore($userStore);
  const { loadedState } = useStore($chatStore);
  const [chatLink, setChatLink] = useState<string>("");
  const [chatLinkError, setChatLinkError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: change reconnect logic after
    const cookie = parseCookies();
    if (!cookie) return;

    if (cookie.chatToken && cookie.chatUser) {
      setChatLinkError(null);
      connectChat({ userName: cookie?.chatUser, chatId: cookie?.chatToken });
    }
  }, []);

  const onEnterChatClick = () => {
    if (!chatLink.length) {
      setChatLinkError("Enter chat id");
      return;
    }
    connectChat({ userName: name, chatId: chatLink });
  };
  const onInputChange = (value: string) => {
    setChatLink(value);
  };
  const newChatClickHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    createChat({ userName: name });
  };

  return (
    <div className="addChatWrapper w-full">
      {loadedState === LoadStateStatus.fetching ? (
        <Spinner />
      ) : (
        <>
          <div className="h2 mb-3.5">Enter chat link</div>
          <FieldInput
            value={chatLink}
            onChange={onInputChange}
            onSubmit={onEnterChatClick}
            error={chatLinkError}
          />
          <button className="button mt-2 mb-3.5" onClick={onEnterChatClick}>
            Enter
          </button>
          <a
            href="#"
            className="font-thin underline"
            onClick={newChatClickHandler}
          >
            or create new chat
          </a>
        </>
      )}
    </div>
  );
};
