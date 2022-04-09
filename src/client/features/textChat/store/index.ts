import { createStore } from "effector";
// import { parseCookies } from "nookies";
//
// import { WsMessageType } from "../../../services/ws/types";
// import { wsService } from "../../../services/ws";
// import { UserType } from "../types";

// import { createUser } from "./events";
// import { updateUserListBridgeFx } from "./wsBridge";

// account store
const initialState = {
  list: [
    {
      id: 1,
      chatName: "mainChat",
      users: [1, 2, 3],
    },
  ],
};

export const $chatStore = createStore(initialState);
