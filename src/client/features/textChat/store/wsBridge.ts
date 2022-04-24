import { createWsBridge } from "../../../services/ws/createWsBridge";

export const namespace = "chat";

const { ev: createChat, bridge: createChatBridgeEvent } =
  createWsBridge<object>("createChat");

const { ev: connectChat, bridge: connectChatBridgeEvent } =
  createWsBridge<string>("connectChat");

export {
  createChat,
  createChatBridgeEvent,
  connectChat,
  connectChatBridgeEvent,
};
