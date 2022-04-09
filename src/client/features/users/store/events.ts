import { WsMessageType } from "../../../services/ws/types";
import { UserType } from "../types";
import { nanoid } from "nanoid";

export const namespace = "account";

export const createUser = (userName: string): WsMessageType<UserType> => ({
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
