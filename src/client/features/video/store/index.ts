import { createEvent, createStore, sample } from "effector";
import { wsService, createWsApi } from "../../../services/ws";
import { IWsMessage } from "../../../services/ws/types";
import { PeerConnectService } from "../services/PeerConnectService";
// import { MediaHandlerService } from "../services/MediaHandlerService";
// import { VCController } from "../services/VCController";

type startVideoChatMsgT = {
  offer?: any;
  answer?: any;
  candidate?: any;
  destinationUserId: string;
  sourceUserId: string;
  chatId: string;
};

type startVideoChatET = {
  destinationUserId: string;
  sourceUserId: string;
  chatId: string;
};

type VideoStore = {
  sourceUserId: null | string;
  destinationUserId: null | string;
  chatId: null | string;
  isActive: boolean;
  offerAccepted: boolean;
  awaitConnect: boolean;
};

const {
  ev: starVideoChat,
  bridge: starVideoChatWsEvent,
  wsMsgBuilder: starVideoChatReqBuilder,
} = createWsApi<startVideoChatET, IWsMessage<any>, startVideoChatMsgT>(
  "startVideoChat",
);

const {
  ev: iceCandidateEvent,
  bridge: iceCandidateWsEvent,
  wsMsgBuilder: iceCandidateReqBuilder,
} = createWsApi<any, any, startVideoChatMsgT>("iceCandidate");

const connectedPeerEvent = createEvent("connectedPeer");

const peerConnectService = new PeerConnectService({});
const initServiceOnVideoStart = () => {
  if (!peerConnectService.isInit) {
    peerConnectService.init(connectedPeerEvent, iceCandidateEvent);
  }
};
// const mediaService = new MediaHandlerService();

const initialState = {
  sourceUserId: null,
  destinationUserId: null,
  chatId: null,
  isActive: false,
  offerAccepted: false,
  awaitConnect: false,
};

const $videoChatStore = createStore<VideoStore>(initialState)
  // @ts-ignore
  .on(starVideoChat, (store, { destinationUserId, chatId }) => {
    return {
      ...store,
      destinationUserId,
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
        destinationUserId: result.payload.sourcedUserId,
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
starVideoChat.watch(async ({ destinationUserId, chatId, sourceUserId }) => {
  initServiceOnVideoStart();
  await peerConnectService.getOffer((offer: any) =>
    wsService.send(
      starVideoChatReqBuilder({
        offer,
        destinationUserId,
        chatId,
        sourceUserId,
      }),
    ),
  );
});

starVideoChatWsEvent.watch(async (res) => {
  initServiceOnVideoStart();

  if (res.payload.answer) {
    await peerConnectService.handlerAnswer(res.payload.answer);
  }

  if (res.payload.offer) {
    await peerConnectService.handleOffer(res.payload.offer, (answer: any) =>
      wsService.send(
        starVideoChatReqBuilder({
          answer,
          destinationUserId: res.payload.sourceUserId,
          chatId: res.payload.chatId,
          sourceUserId: res.payload.destinationUserId,
        }),
      ),
    );
  }
});

sample({
  source: $videoChatStore,
  clock: iceCandidateEvent,
  fn: (store, candidate) => {
    const { destinationUserId, chatId, sourceUserId } = store;
    console.log("iceCandidateEvent call");
    wsService.send(
      iceCandidateReqBuilder({
        candidate: candidate,
        // @ts-ignore
        destinationUserId,
        // @ts-ignore
        chatId,
        // @ts-ignore
        sourceUserId,
      }),
    );
  },
});

iceCandidateWsEvent.watch(async (message) => {
  console.log("Get candidate message", message);
  await peerConnectService.msgICEHandler(message.payload.candidate);
});

connectedPeerEvent.watch(() => {
  console.log("Connected");
  // after connect event
});

export { starVideoChat, $videoChatStore };
