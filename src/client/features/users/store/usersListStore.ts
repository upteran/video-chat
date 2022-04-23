// user list
import { createStore } from "effector";
import { updateUserListBridgeFx } from "./wsBridge";
import { WsMessageType } from "../../../services/ws/types";
import { UserType } from "../types";
import { setCookie } from "nookies";

const list = [
  {
    userId: "asdad",
    name: "some new name",
    chatId: 1,
    messages: [1, 2, 3],
  },
  {
    userId: "asdadasdasdsa",
    name: "some new name 1",
    chatId: 1,
    messages: [4],
  },
];

export const $userList = createStore(list).on(
  // @ts-ignore
  updateUserListBridgeFx.done,
  (list, { result }: { result: WsMessageType<UserType> }) => {
    console.log("add user to list", result);
    return result?.params ? [...list, result.params] : [];
  },
);

$userList.watch((messages) => {
  if (messages.length) {
    // const [user]: Array<UserType> = messages;
    // setCookie(null, "token", user.userId, {
    //   maxAge: 30 * 24 * 60 * 60,
    //   path: "/",
    // });
  }
});
