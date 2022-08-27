/* eslint-jest */

import { socketController } from "./SocketsController";

const loggerMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info: () => {},
};

socketController.initLogger(loggerMock);

let mockList = [];

const chatId = {
  first: 1,
  second: 2,
};

const createMockChatMap = () => {
  const mockChatGraph = new Map();
  mockChatGraph.set(chatId.first, new Set());
  mockChatGraph.set(chatId.second, new Set());
  return mockChatGraph;
};

const sendMock = jest.fn();

describe("socket controller class", () => {
  beforeEach(() => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    mockList = ids.map((id) => ({
      clientId: id,
      socket: { socketMeta: null, send: sendMock },
    }));
  });
  test("addSocket", () => {
    const expectedList = new Map();
    const createMockTemplate = (id) => ({
      chatId: null,
      clientId: id,
      socket: {
        clientId: id,
        socketMeta: null,
        send: sendMock,
      },
    });
    mockList.forEach((s) => {
      socketController.addSocket(s.socket, s.clientId);
      expectedList.set(s.clientId, createMockTemplate(s.clientId));
    });
    const sL = socketController.socketsList;
    expect(sL.length).toEqual(9);
    expect(expectedList).toEqual(socketController.socketListFullData);
  });

  test("removeSocket all sockets", () => {
    const sockets = [];
    mockList.forEach(({ clientId, socket }) => {
      socketController.addSocket(socket, clientId);
      sockets.push({ clientId });
    });
    const sL = socketController.socketsList;
    expect(sL.length).toEqual(9);
    sockets.forEach((socket, idx) => {
      socketController.removeSocket(socket);
      const sL = socketController.socketsList;
      expect(sL.length).toEqual(sockets.length - idx - 1);
    });
  });

  test("removeSocket sockets by id", () => {
    mockList.forEach(({ clientId, socket }) => {
      socketController.addSocket(socket, clientId);
    });
    socketController.removeSocket({ clientId: 2 });
    expect(socketController.socketsList).toEqual([1, 3, 4, 5, 6, 7, 8, 9]);
    socketController.removeSocket({ clientId: 7 });
    expect(socketController.socketsList).toEqual([1, 3, 4, 5, 6, 8, 9]);
  });

  test("connectChatWithSocket", () => {
    const mockChatGraph = createMockChatMap();

    mockList.forEach(({ socket, clientId }) => {
      socketController.addSocket(socket, clientId);
      if (clientId % 2 !== 0) {
        const g = mockChatGraph.get(chatId.first);
        g.add(clientId);
        socketController.connectChatWithSocket(socket, chatId.first);
      } else {
        const g = mockChatGraph.get(chatId.second);
        g.add(clientId);
        socketController.connectChatWithSocket(socket, chatId.second);
      }
    });
    expect(socketController.chatsIds).toEqual([chatId.first, chatId.second]);
    expect(socketController.chatIdsToSocket).toEqual(mockChatGraph);
  });

  test("should remove chat id connections", () => {
    const mockChatGraph = createMockChatMap();

    mockList.forEach(({ socket, clientId }) => {
      socketController.addSocket(socket, clientId);
      if (clientId % 2 !== 0) {
        const g = mockChatGraph.get(chatId.first);
        g.add(clientId);
        socketController.connectChatWithSocket(socket, chatId.first);
      } else {
        const g = mockChatGraph.get(chatId.second);
        g.add(clientId);
        socketController.connectChatWithSocket(socket, chatId.second);
      }
    });

    const removedChats = [
      {
        socket: { clientId: 3 },
        chatId: chatId.first,
      },
      {
        socket: { clientId: 5 },
        chatId: chatId.first,
      },
      {
        socket: { clientId: 7 },
        chatId: chatId.first,
      },
      {
        socket: { clientId: 2 },
        chatId: chatId.second,
      },
      {
        socket: { clientId: 8 },
        chatId: chatId.second,
      },
    ];

    removedChats.forEach(({ socket, chatId }) => {
      socketController.removeChatFromSocket(socket, chatId);
      const chat = mockChatGraph.get(chatId);
      chat.delete(socket.clientId);
    });
    expect(socketController.chatIdsToSocket).toEqual(mockChatGraph);

    // remove last two sockets and chatId.first key
    socketController.removeChatFromSocket({ clientId: 1 }, chatId.first);
    socketController.removeChatFromSocket({ clientId: 9 }, chatId.first);
    mockChatGraph.delete(chatId.first);
    expect(socketController.chatIdsToSocket).toEqual(mockChatGraph);
  });

  test("send msg to all sockets from chat", () => {
    mockList.forEach(({ socket, clientId }) => {
      socketController.addSocket(socket, clientId);
      if (clientId % 2 !== 0) {
        // 1, 3, 5, 7, 9
        socketController.connectChatWithSocket(socket, chatId.first);
      } else {
        // 2, 4, 6, 8
        socketController.connectChatWithSocket(socket, chatId.second);
      }
    });
    socketController.sendMsgToClients(chatId.second, "Hello sockets", {
      toSelf: false,
      currWsId: 1,
    });
    expect(sendMock).toHaveBeenCalledTimes(4);
  });

  test("should not send msg to self", () => {
    mockList.forEach(({ socket, clientId }) => {
      socketController.addSocket(socket, clientId);
      if (clientId % 2 !== 0) {
        // 1, 3, 5, 7, 9
        socketController.connectChatWithSocket(socket, chatId.first);
      } else {
        // 2, 4, 6, 8
        socketController.connectChatWithSocket(socket, chatId.second);
      }
    });
    socketController.sendMsgToClients(chatId.first, "Hello sockets", {
      toSelf: false,
      currWsId: 1,
    });
    expect(sendMock).toHaveBeenCalledTimes(4);
  });
});
