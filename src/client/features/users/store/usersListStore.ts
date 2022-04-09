// user list
import { createStore } from "effector";
import { updateUserListBridgeFx } from "./wsBridge";
import { WsMessageType } from "../../../services/ws/types";
import { UserType } from "../types";
import { setCookie } from "nookies";

export const $userList = createStore([]).on(
  // @ts-ignore
  updateUserListBridgeFx.done,
  (list, { result }: { result: WsMessageType<UserType> }) => {
    console.log("add user to list", result);
    return result?.params ? [...list, result.params] : [];
  },
);

$userList.watch((messages) => {
  if (messages.length) {
    const [user]: Array<UserType> = messages;
    setCookie(null, "token", user.userId, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
});
