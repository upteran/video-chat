import { createEvent } from "effector";
import { wsService } from "./WebSocketService";
import { IWsMessage } from "./types";
import { nanoid } from "nanoid";

export const createWsApi = <T, E, M>(type: string) => {
  const ev = createEvent<T>(`${type}Init`);
  const bridge = createEvent<E>(`${type}Ws`);
  const wsMsgBuilder = (payload: M): IWsMessage<M> => ({
    id: nanoid(),
    method: type,
    payload,
  });

  const apiSend = (payload: M): void => {
    wsService.send(wsMsgBuilder(payload));
  };

  wsService.subscribeStore({ name: type, cb: bridge });

  return { ev, bridge, apiSend };
};
