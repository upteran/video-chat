import { UserType } from "../../user/types";

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
  messagesInfoMap: null | {
    [key: string]: {
      id: string;
      name: string;
      color: string;
    };
  };
};
