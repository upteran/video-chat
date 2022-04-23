import { UserType } from "../../users/types";

export interface IChat {
  chatId: string;
  users: Array<UserType>;
}

export type ChatStateType = {
  chat: IChat | null;
  isLoaded: boolean;
  isFetching: boolean;
};
