import { createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { createEvent } from "effector";

type peerConnectMsgT = {
  offer?: any;
  answer?: any;
  candidate?: any;
  chatId: string;
};

type startVideoChatET = {
  chatId: string;
};

export const {
  ev: _,
  bridge: peerEventsBridge,
  wsMsgBuilder: peerEventsMsgBuilder,
} = createWsApi<startVideoChatET, IWsMessage<peerConnectMsgT>, peerConnectMsgT>(
  "peerEvents",
);

export const openVideoEvent = createEvent<{ chatId: string }>("openVideo");
export const sendPeerOffer = createEvent<startVideoChatET>("sendPeerOffer");
export const sendPeerAnswer = createEvent<any>("sendPeerAnswer");
export const connectedPeerEvent = createEvent("connectedPeer");
