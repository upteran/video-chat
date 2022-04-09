export type UserType = {
  userId: string;
  name: string;
  chatId: string;
  messages: Array<string>;
};

export type UserAccountType = {
  loggedIn: boolean;
};
