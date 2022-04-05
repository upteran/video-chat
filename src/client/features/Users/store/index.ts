import { createStore, createEffect } from "effector";
import { nanoid } from "nanoid";
import { setCookie } from "nookies";

import { WsMessageType } from "../../../services/ws/types";
import { wsService } from "../../../services/ws";
import { UserType } from "../types";

const namespace = "account";

const createUser = (userName: string): WsMessageType<UserType> => ({
  id: nanoid(),
  namespace,
  method: "addUser",
  params: {
    name: userName,
    chatId: nanoid(),
    userId: nanoid(),
    messages: [],
  },
});

export const sendUserFx = createEffect((userName: string) => {
  wsService.send(createUser(userName));
});

const updateUserListFx = createEffect();

updateUserListFx.use((data: any) => {
  return data;
});

// store fn
wsService.subscribeStore({ name: namespace, cb: updateUserListFx });

export const $userList = createStore([])
  .on(sendUserFx.done, (_, messages) => {
    console.log("msg", messages);
  })
  .on(
    // @ts-ignore
    updateUserListFx.done,
    (list, { result }: { result: WsMessageType<UserType> }) => {
      console.log("WORK user", result);
      return result?.params ? [...list, result.params] : [];
    },
  );

$userList.watch((messages) => {
  console.log("change watch", messages);
  if (messages.length) {
    const [user]: Array<UserType> = messages;
    setCookie(null, "token", user.userId, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
});
