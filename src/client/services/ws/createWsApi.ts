import { createEvent } from "effector";
import { wsService } from "./WebSocketService";
import { nanoid } from "nanoid";

export const createWsApi = <T, E, M>(type: string) => {
  const ev = createEvent<T>(`${type}Init`);
  const bridge = createEvent<E>(`${type}Ws`);
  const wsMsgBuilder = (payload: M) => ({
    id: nanoid(),
    method: type,
    payload,
  });

  wsService.subscribeStore({ name: type, cb: bridge });

  return { ev, bridge, wsMsgBuilder };
};
