import { createEvent } from "effector";
import { wsService } from "../../../services/ws";

export const namespace = "chat";

export const createChatBridgeEvent = createEvent("createChat");

// store fn
wsService.subscribeStore({ name: namespace, cb: createChatBridgeEvent });
