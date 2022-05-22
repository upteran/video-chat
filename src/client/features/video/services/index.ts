import { MediaHandlerService } from "./MediaHandlerService";
import { PeerConnectService } from "./PeerConnectService";
import { connectedPeerEvent } from "../store/events";

const mediaService = new MediaHandlerService({
  media: {
    video: true,
    audio: true,
  },
});

const peerConnectService = new PeerConnectService({});

// init must be after DOM load
const initServiceOnVideoStart = async (local: any, remote: any) => {
  mediaService.initOutput({
    local,
    remote,
  });
  peerConnectService.init({
    onConnect: connectedPeerEvent,
    mediaService,
  });
};

export { initServiceOnVideoStart, peerConnectService };
