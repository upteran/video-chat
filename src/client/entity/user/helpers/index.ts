import { UserType } from "../types";
import { nanoid } from "nanoid";

export const createUser = (userName: string, chatId: string): UserType => ({
  name: userName,
  chatId,
  userId: nanoid(),
});
