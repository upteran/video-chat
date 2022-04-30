// TODO: add message builders to socketApi builder
export const buildCreateChatMsg = (chatId: string, users: Array<object>) => {
  return {
    method: "createChat",
    payload: {
      chatId,
      users,
    },
  };
};

export const buildConnectChatMsg = (chatId: string, user: any) => {
  return {
    method: "connectChat",
    payload: {
      chatId,
      user,
    },
  };
};

export const buildRemoveFromChatMsg = (chatId: string, user: any) => {
  return {
    method: "removeFromChat",
    payload: {
      chatId,
      user,
    },
  };
};
