import { createEvent, createStore, sample } from "effector";
import { wsService, createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { PeerConnectService } from "../services/PeerConnectService";
import { MediaHandlerService } from "../services/MediaHandlerService";
// import { VCController } from "../services/VCController";

type peerConnectMsgT = {
  offer?: any;
  answer?: any;
  candidate?: any;
  // destinationUserId: string;
  // sourceUserId: string;
  chatId: string;
};

type startVideoChatET = {
  destinationUserId: string;
  sourceUserId: string;
  chatId: string;
};

type VideoStore = {
  // sourceUserId: null | string;
  // destinationUserId: null | string;
  chatId: null | string;
  isActive: boolean;
  offerAccepted: boolean;
  awaitConnect: boolean;
};

const {
  ev: starVideoChat,
  bridge: starVideoChatWsEvent,
  wsMsgBuilder: starVideoChatReqBuilder,
} = createWsApi<startVideoChatET, IWsMessage<peerConnectMsgT>, peerConnectMsgT>(
  "startVideoChat",
);

const { bridge: iceCandidateWsEvent, wsMsgBuilder: iceCandidateReqBuilder } =
  createWsApi<any, IWsMessage<peerConnectMsgT>, peerConnectMsgT>(
    "iceCandidate",
  );

const connectedPeerEvent = createEvent("connectedPeer");

const peerConnectService = new PeerConnectService({ signalService: wsService });
const initServiceOnVideoStart = () => {
  if (!peerConnectService.isInit) {
    peerConnectService.init(connectedPeerEvent);
  }
};
// const mediaService = new MediaHandlerService();

const initialState = {
  // sourceUserId: null,
  // destinationUserId: null,
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

// @ts-ignore
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

iceCandidateWsEvent.watch(async ({ payload }) => {
  console.log("Get candidate message", payload);
  await peerConnectService.msgICEHandler(payload.candidate);
});

connectedPeerEvent.watch(() => {
  console.log("Connected");
  // after connect event
});

export { starVideoChat, $videoChatStore };
