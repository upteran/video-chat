import { createEvent } from "effector";
import { wsService } from "./WebSocketService";

export const createWsBridge = <ET>(type: string) => {
  const ev = createEvent<ET>(type);
  const bridge = createEvent<ET>(`${type}Ws`);

  wsService.subscribeStore({ name: type, cb: bridge });

  return { ev, bridge };
};
