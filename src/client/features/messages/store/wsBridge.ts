import { createEvent } from "effector";
import { wsService } from "../../../services/ws";

export const updateMessagesListBridgeEvent = createEvent(
  "updateMessagesListEvent",
);

// store fn
wsService.subscribeStore({
  name: "sendMessage",
  cb: updateMessagesListBridgeEvent,
});
