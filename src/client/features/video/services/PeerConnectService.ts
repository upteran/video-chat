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
  pc: null | RTCPeerConnection;
  config: any;
  iceSend: boolean;
  candidateQueue: Array<RTCIceCandidateInit>;
  onConnect: ((ev: any) => void) | null;
  mediaService: any;
  stream: MediaStream;

  constructor(config: any) {
    this.config = config;
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
    this.pc = new RTCPeerConnection(conf);
    this.onConnect = onConnect;
    this.mediaService = mediaService;

    this.connectionStatusListener();
    this.msgLocalICEHandler();
  }

  async addStreamToConnect() {
    try {
      this.stream = await this.mediaService.getMediaStream();
      this.stream.getTracks().forEach((track: any) => {
        this.pc?.addTrack(track, this.stream);
      });
      this.mediaService.localContainer.srcObject = this.stream;
    } catch (err) {
      console.log(err);
    }
  }

  connectionStatusListener = () => {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }
    this.pc.addEventListener("connectionstatechange", (event: any) => {
      if (this.pc?.connectionState === "connected") {
        console.log("Connection establish!");
        this.onConnect && this.onConnect(event);
      }
    });
  };

  msgLocalICEHandler = () => {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }
    this.pc.addEventListener("icecandidate", (event: any) => {
      if (event.candidate && !this.iceSend) {
        this.iceSend = true;
        this.candidateQueue.push(event.candidate);
        console.log("Add to queue candidate ICE!");
      }
    });
  };

  candidateMsgHandler = async (message: RTCIceCandidate) => {
    if (!this.pc) {
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
    this.pc?.addEventListener("track", (event) => {
      const [remoteStream] = event.streams;
      this.mediaService.remoteContainer.srcObject = remoteStream;
    });
  }

  async createOffer(onSuccess: any): Promise<any> {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }

    await this.addStreamToConnect();
    this.initTrackEvent();

    this.pc
      .createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((offer: RTCSessionDescriptionInit) => {
        this.pc?.setLocalDescription(offer);
        return offer;
      })
      .then((offer: RTCSessionDescriptionInit) => {
        onSuccess(offer);
      })
      .catch((err) => console.log(err));
  }

  async offerHandler(
    offer: RTCSessionDescription,
    onSuccess: any,
  ): Promise<any> {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }
    await this.addStreamToConnect();
    this.initTrackEvent();

    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

    this.pc
      .createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((answerRes: any) => {
        this.pc?.setLocalDescription(answerRes);
        return answerRes;
      })
      .then((answer: any) => {
        onSuccess(answer);
      })
      .catch((err) => console.log(err));
  }

  async handlerAnswer(answer: any, onSuccess: any) {
    if (!this.pc) {
      throw new Error("peerConnection must be init");
    }
    const rTCSession = new RTCSessionDescription(answer);
    await this.pc.setRemoteDescription(rTCSession);

    onSuccess(this.candidateQueue[0]);
  }

  closePeerConnection() {
    this.pc?.close();
    try {
      this.stream.getTracks().forEach((track: any) => {
        if (track.readyState == "live") {
          track.stop();
        }
      });
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
