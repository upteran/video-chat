import { createStore, createEffect } from "effector";
import { parseCookies } from "nookies";

import { WsMessageType } from "../../../services/ws/types";
import { wsService } from "../../../services/ws";
import { UserType } from "../types";

import { createUser } from "./events";
import { updateUserListBridgeFx } from "./wsBridge";

// account store
const initialState = {
  isLogin: parseCookies()?.token || false,
  name: "",
  id: null,
};

export const $accountData = createStore(initialState).on(
  // @ts-ignore
  updateUserListBridgeFx.done,
  (list, { result }: { result: WsMessageType<UserType> }) => {
    console.log("login", result);
    return {
      isLogin: true,
      ...result.params,
    };
  },
);

export const sendUserFx = createEffect((userName: string) => {
  wsService.send(createUser(userName));
});
