import { Chat } from "entity/chat/types";
import { CloseTypes } from "./consts";

export type PeerConnectMsg = {
  offer?: RTCOfferOptions;
  answer?: RTCAnswerOptions;
  candidate?: RTCIceCandidate;
  chatId: Chat["chatId"];
};

export type StartVideoChatEv = {
  chatId: Chat["chatId"];
};

export type CloseMsg = {
  chatId: Chat["chatId"];
  closeType: CloseTypes;
};

export type VideoStore = {
  chatId: null | Chat["chatId"];
  isActive: boolean;
  awaitConnect: boolean;
  offer: null | RTCOfferOptions;
  answer: null| RTCAnswerOptions;
  isHost: boolean;
};
