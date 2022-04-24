import { createEvent } from "effector";
import { wsService } from "./WebSocketService";

export const createWsApi = <T, E>(type: string) => {
  const ev = createEvent<T>(`${type}Init`);
  const bridge = createEvent<E>(`${type}Ws`);

  wsService.subscribeStore({ name: type, cb: bridge });

  return { ev, bridge };
};
