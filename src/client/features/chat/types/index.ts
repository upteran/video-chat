import { UserType } from "../../users/types";

export interface IChat {
  chatId: string;
  users: Array<UserType>;
}

export interface IChatConnected extends IChat {
  messages: Array<object>;
}

export type ChatStateType = {
  chat: IChat | null;
  isLoaded: boolean;
  isFetching: boolean;
  messages: Array<object>;
};
