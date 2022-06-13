import { createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { createEvent } from "effector";
import { PeerConnectMsg, StartVideoChatEv, CloseMsg } from "../types";

export const {
  ev: _,
  bridge: peerEventsBridge,
  apiSend: peerEventsApi,
} = createWsApi<StartVideoChatEv, IWsMessage<PeerConnectMsg>, PeerConnectMsg>(
  "peerEvents",
);

export const {
  ev: connectClose,
  bridge: connectCloseBridge,
  apiSend: connectCloseApi,
} = createWsApi<{ chatId: string }, IWsMessage<CloseMsg>, CloseMsg>(
  "connectClose",
);

export const openVideoEvent = createEvent<{ chatId: string }>("openVideo");
export const sendPeerOffer = createEvent<StartVideoChatEv>("sendPeerOffer");
export const sendPeerAnswer = createEvent<any>("sendPeerAnswer");
export const connectedPeerEvent = createEvent("connectedPeer");
