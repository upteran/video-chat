import adapter from "webrtc-adapter";

const conf = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  video: { facingMode: "user" },
  configuration: {
    video: true,
    audio: true,
  },
};

// TODO: add types
export class PeerConnectService {
  pc: RTCPeerConnection;
  config: any;
  iceSend: boolean;
  candidateQueue: Array<RTCIceCandidateInit>;
  onConnect: ((ev: any) => void) | null;
  mediaService: any;
  stream: MediaStream;

  constructor(config: any) {
    this.config = config;
    // @ts-ignore
    this.pc = null;
    this.iceSend = false;
    this.candidateQueue = [];
    this.onConnect = null;
    this.mediaService = null;
    // @ts-ignore
    this.stream = null;
  }

  get isInit() {
    return !!this.pc;
  }

  init({ onConnect, mediaService }: any) {
    // this.config use
    if (this.isInit) return;

    this.createRTCPConnection();
    this.onConnect = onConnect;
    this.mediaService = mediaService;
  }

  createRTCPConnection = () => {
    this.pc = new RTCPeerConnection(conf);
    this.connectionStatusListener("add");
    this.msgLocalICEListener("add");
  };

  async addStreamToConnect() {
    try {
      if (this.checkSignalIs("closed")) {
        console.log("Try to addStreamToConnect to close connection");
        return;
      }

      this.stream = await this.mediaService.getMediaStream();
      this.stream.getTracks().forEach((track: any) => {
        if (!this.checkSignalIs("closed")) {
          this.pc.addTrack(track, this.stream);
        }
      });
      this.mediaService.localContainer.srcObject = this.stream;
    } catch (err) {
      console.log(err);
      this.closeMedia();
    }
  }

  checkSignalIs = (state: RTCSignalingState): boolean => {
    return this.pc.signalingState === state;
  };

  connectionStatusListener = (action = "add") => {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }
    if (action === "add") {
      this.pc.addEventListener("connectionstatechange", this.onConnectHandler);
    } else {
      this.pc.removeEventListener(
        "connectionstatechange",
        this.onConnectHandler,
      );
    }
  };

  onConnectHandler = (ev: any) => {
    if (this.pc.connectionState === "connected") {
      console.log("Connection establish!");
      this.onConnect && this.onConnect(ev);
    }
  };

  msgLocalICEListener = (action = "add") => {
    if (!this.isInit) {
      throw new Error("peerConnection must be init");
    }
    if (action === "add") {
      this.pc.addEventListener("icecandidate", this.iceCandidateQueueHandler);
    } else {
      this.pc.removeEventListener(
        "icecandidate",
        this.iceCandidateQueueHandler,
      );
    }
  };

  iceCandidateQueueHandler = (event: any) => {
    if (event.candidate && !this.iceSend) {
      this.iceSend = true;
      this.candidateQueue.push(event.candidate);
      console.log("Add to queue candidate ICE!", event.candidate);
    }
  };

  candidateMsgHandler = async (message: RTCIceCandidate) => {
    if (!this.isInit) {
      throw new Error("peerConnection must be init");
    }
    if (message) {
      try {
        console.log("inner", message);
        await this.pc.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  };

  initTrackEvent() {
    this.pc.addEventListener("track", (event) => {
      const [remoteStream] = event.streams;
      this.mediaService.remoteContainer.srcObject = remoteStream;
    });
  }

  async createOffer(onSuccess: any): Promise<any> {
    if (!this.isInit) {
      throw new Error("peerConnection must be init");
    }

    console.log("OFFER CREATE", this.pc.signalingState);

    if (this.checkSignalIs("closed")) {
      console.log("Try to createOffer to close connection");
      this.createRTCPConnection();
    }

    await this.addStreamToConnect();
    this.initTrackEvent();

    this.pc
      .createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((offer: RTCSessionDescriptionInit) => {
        this.pc.setLocalDescription(offer);
        return offer;
      })
      .then((offer: RTCSessionDescriptionInit) => {
        onSuccess(offer);
      })
      .catch((err) => {
        console.log(err);
        this.closeMedia();
      });
  }

  async offerHandler(
    offer: RTCSessionDescription,
    onSuccess: any,
  ): Promise<any> {
    if (!this.isInit) {
      throw new Error("peerConnection must be init");
    }

    if (this.checkSignalIs("closed")) {
      console.log("Try offerHandler of wrong connection connection");
      this.createRTCPConnection();
    }

    await this.addStreamToConnect();
    this.initTrackEvent();

    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

    this.pc
      .createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((answerRes: any) => {
        this.pc.setLocalDescription(answerRes);
        return answerRes;
      })
      .then((answer: any) => {
        onSuccess(answer);
      })
      .catch((err) => {
        console.log(err);
        this.closeMedia();
      });
  }

  async handlerAnswer(answer: any, onSuccess: any) {
    if (!this.isInit) {
      throw new Error("peerConnection must be init");
    }

    if (this.checkSignalIs("closed") || this.checkSignalIs("stable")) {
      console.log("Try to handlerAnswer to close connection");
      return;
    }

    const rTCSession = new RTCSessionDescription(answer);
    await this.pc.setRemoteDescription(rTCSession);

    // TODO: create common cases logic
    onSuccess(this.candidateQueue[this.candidateQueue.length - 1]);
  }

  closeMedia = () => {
    if (!this.stream) return;

    this.stream.getTracks().forEach((track: any) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  };

  closePeerConnection() {
    if (!this.isInit) return;

    try {
      this.pc.close();
      this.closeMedia();
      this.iceSend = false;
      this.candidateQueue = [];
      this.connectionStatusListener("remove");
      this.msgLocalICEListener("remove");

      console.log("closePeerConnection end!");
    } catch (err) {
      console.log(err);
    }
  }

  onConnectClose(cb: any) {
    this.pc?.addEventListener("close", () => {
      console.log("close connection");
      cb();
    });
  }
}
