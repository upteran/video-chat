import { createEvent } from "effector";
import { wsService } from "../../../services/ws";

const namespace = "message";

export const updateMessagesListBridgeEvent = createEvent(
  "updateMessagesListEvent",
);

// store fn
wsService.subscribeStore({ name: namespace, cb: updateMessagesListBridgeEvent });
