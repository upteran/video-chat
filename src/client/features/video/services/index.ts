import { MediaHandlerService } from "./MediaHandlerService";
import { PeerConnectService } from "./PeerConnectService";
import { wsService } from "../../../services/ws";
import { connectedPeerEvent } from "../store/events";

const mediaService = new MediaHandlerService({
  media: {
    video: true,
    audio: true,
  },
  streamWindow: document.getElementById("video"),
});

const peerConnectService = new PeerConnectService({
  signalService: wsService,
  mediaService,
});

const initServiceOnVideoStart = () => {
  if (!peerConnectService.isInit) {
    peerConnectService.init({
      onConnect: connectedPeerEvent,
    });
  }
};

export { initServiceOnVideoStart, peerConnectService };
