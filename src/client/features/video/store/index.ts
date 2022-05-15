import { createStore } from "effector";
import { wsService } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { peerConnectService, initServiceOnVideoStart } from "../services";
import {
  starVideoChatReqBuilder,
  iceCandidateReqBuilder,
  iceCandidateWsEvent,
  starVideoChatWsEvent,
  connectedPeerEvent,
  starVideoChat,
} from "./events";

type VideoStore = {
  chatId: null | string;
  isActive: boolean;
  offerAccepted: boolean;
  awaitConnect: boolean;
};

const initialState = {
  chatId: null,
  isActive: false,
  offerAccepted: false,
  awaitConnect: false,
};

const $videoChatStore = createStore<VideoStore>(initialState)
  // @ts-ignore
  .on(starVideoChat, (store, { chatId }) => {
    return {
      ...store,
      chatId,
      awaitConnect: true,
    };
  })
  .on(starVideoChatWsEvent, (store, result: IWsMessage<any>) => {
    if (result.payload.answer) {
      return {
        ...store,
        awaitConnect: true,
        offerAccepted: true,
      };
    }
    if (result.payload.offer) {
      return {
        ...store,
        awaitConnect: true,
        offerAccepted: true,
      };
    }
    return store;
  })
  .on(connectedPeerEvent, (store) => {
    return {
      ...store,
      awaitConnect: false,
      offerAccepted: true,
      isActive: true,
    };
  });

// send offer
starVideoChat.watch(async ({ chatId }) => {
  initServiceOnVideoStart();
  await peerConnectService.getOffer((offer: RTCOfferOptions) =>
    wsService.send(
      starVideoChatReqBuilder({
        offer,
        chatId,
      }),
    ),
  );
});

// return offer/answer
starVideoChatWsEvent.watch(async ({ payload }) => {
  initServiceOnVideoStart();

  if (payload.answer) {
    await peerConnectService.handlerAnswer(payload.answer, (candidate: any) =>
      wsService.send(
        iceCandidateReqBuilder({
          candidate,
          // @ts-ignore
          chatId: payload.chatId,
        }),
      ),
    );
  }

  if (payload.offer) {
    await peerConnectService.handleOffer(payload.offer, (answer: any) =>
      wsService.send(
        starVideoChatReqBuilder({
          answer,
          chatId: payload.chatId,
        }),
      ),
    );
  }
});

// get ice data
iceCandidateWsEvent.watch(async ({ payload }) => {
  console.log("Get candidate message", payload);
  await peerConnectService.msgICEHandler(payload.candidate);
});

connectedPeerEvent.watch(() => {
  console.log("Connected");
});

export { starVideoChat, $videoChatStore };
