import { createEffect } from "effector";
import { wsService } from "../../../services/ws";

const namespace = "message";

export const updateMessagesListBridgeFx = createEffect();

updateMessagesListBridgeFx.use((data: any) => {
  return data;
});

// store fn
wsService.subscribeStore({ name: namespace, cb: updateMessagesListBridgeFx });
