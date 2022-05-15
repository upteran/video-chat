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
  destinationUserId: string;
  sourceUserId: string;
  chatId: string;
};

export const {
  ev: starVideoChat,
  bridge: starVideoChatWsEvent,
  wsMsgBuilder: starVideoChatReqBuilder,
} = createWsApi<startVideoChatET, IWsMessage<peerConnectMsgT>, peerConnectMsgT>(
  "startVideoChat",
);

export const {
  bridge: iceCandidateWsEvent,
  wsMsgBuilder: iceCandidateReqBuilder,
} = createWsApi<any, IWsMessage<peerConnectMsgT>, peerConnectMsgT>(
  "iceCandidate",
);

export const connectedPeerEvent = createEvent("connectedPeer");
