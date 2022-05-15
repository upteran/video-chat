interface VideoControllerConstructor {
  peerConnectService: any;
  mediaService: any;
}

export class VCController {
  peerConnectService: any;
  mediaService: any;

  constructor({
    peerConnectService,
    mediaService,
  }: VideoControllerConstructor) {
    this.peerConnectService = peerConnectService;
    this.mediaService = mediaService;
  }

  get services() {
    return {
      peerConnectService: this.peerConnectService,
      mediaService: this.mediaService,
    };
  }

  clear() {
    this.peerConnectService = null;
    this.mediaService = null;
  }
}

// click call to user
// create offer
// send offer
// wait answer (loader)
// get answer
// send ice candidate (get ice candidate)
// listen connected establish
// get video/audio media
// camera on
// send media

// 1. createPeerOffer
// 2. getAnswer
// 3. createMedia
// 4. SendMedia
