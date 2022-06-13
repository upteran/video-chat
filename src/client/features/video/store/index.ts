import { createStore } from "effector";
import { IWsMessage } from "../../../services/ws/types";
import { peerConnectService } from "../services";
import {
  peerEventsApi,
  peerEventsBridge,
  connectedPeerEvent,
  sendPeerOffer,
  openVideoEvent,
  sendPeerAnswer,
  connectClose,
  connectCloseBridge,
  connectCloseApi,
} from "./events";

import { VideoStore } from "../types";
import { CloseTypes } from "../consts";

const initialState = {
  chatId: null,
  isActive: false,
  awaitConnect: false,
  offer: null,
  answer: null,
  isHost: false,
};

const $videoChatStore = createStore<VideoStore>(initialState)
  .on(openVideoEvent, (store, { chatId }) => {
    return {
      ...store,
      chatId,
      awaitConnect: true,
      isHost: true,
    };
  })
  .on(peerEventsBridge, (store, result: IWsMessage<any>) => {
    if (result.payload.answer) {
      return {
        ...store,
        answer: result.payload.answer,
      };
    }
    if (result.payload.offer) {
      return {
        ...store,
        chatId: result.payload.chatId,
        offer: result.payload.offer,
        awaitConnect: true,
      };
    }
    return store;
  })
  .on(connectedPeerEvent, (store) => {
    return {
      ...store,
      awaitConnect: false,
      isActive: true,
    };
  })
  .reset(connectClose)
  .reset(connectCloseBridge);

// send offer / init rtc service
sendPeerOffer.watch(async ({ chatId }) => {
  await peerConnectService.createOffer((offer: RTCOfferOptions) =>
    peerEventsApi({
      offer,
      chatId,
    }),
  );
});

sendPeerAnswer.watch(async ({ offer, chatId }) => {
  await peerConnectService.offerHandler(
    offer,
    (answer: RTCOfferAnswerOptions) =>
      peerEventsApi({
        answer,
        chatId,
      }),
  );
});

// handle offer and candidate message / init rtc service
peerEventsBridge.watch(async ({ payload }) => {
  if (payload.answer) {
    await peerConnectService.handlerAnswer(
      payload.answer,
      (candidate: RTCIceCandidate) =>
        peerEventsApi({
          candidate,
          chatId: payload.chatId,
        }),
    );
  }

  // get ice data
  if (payload.candidate) {
    await peerConnectService.candidateMsgHandler(payload.candidate);
  }
});

connectedPeerEvent.watch(() => {
  console.log("Connected");
});

connectClose.watch(({ chatId }) => {
  peerConnectService.closePeerConnection();
  connectCloseApi({ chatId, closeType: CloseTypes.user });
  console.log("CLOSED");
});

connectCloseBridge.watch(() => {
  console.log("RESPONSE CLOSED");
  peerConnectService.closePeerConnection();
});

export { $videoChatStore, sendPeerOffer, openVideoEvent, sendPeerAnswer };
