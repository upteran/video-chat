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
  peerConnection: null | RTCPeerConnection;
  config: any;
  iceSend: boolean;
  candidateQueue: Array<RTCIceCandidateInit>;
  onConnect: ((ev: any) => void) | null;
  mediaService: any;

  constructor(config: any) {
    this.config = config;
    this.peerConnection = null;
    this.iceSend = false;
    this.candidateQueue = [];
    this.onConnect = null;
    this.mediaService = null;
  }

  get isInit() {
    return !!this.peerConnection;
  }

  init({ onConnect, onConnectClose, mediaService }: any) {
    // this.config use
    if (this.isInit) return;
    this.peerConnection = new RTCPeerConnection(conf);
    this.onConnect = onConnect;
    this.mediaService = mediaService;

    this.msgLocalICEHandler();
    this.connectionStatusListener();
    this.onConnectClose(onConnectClose);
  }

  async addStreamToConnect() {
    try {
      const stream = await this.mediaService.getMediaStream();
      stream.getTracks().forEach((track: any) => {
        this.peerConnection?.addTrack(track, stream);
      });
      this.mediaService.localContainer.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  }

  connectionStatusListener = () => {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    this.peerConnection.addEventListener(
      "connectionstatechange",
      (event: any) => {
        if (this.peerConnection?.connectionState === "connected") {
          console.log("Connection establish!");
          this.onConnect && this.onConnect(event);
        }
      },
    );
  };

  msgLocalICEHandler = () => {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    this.peerConnection.addEventListener("icecandidate", (event: any) => {
      if (event.candidate && !this.iceSend) {
        this.iceSend = true;
        this.candidateQueue.push(event.candidate);
        console.log("Add to queue candidate ICE!");
      }
    });
  };

  candidateMsgHandler = async (message: RTCIceCandidate) => {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    if (message) {
      try {
        console.log("inner", message);
        await this.peerConnection.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  };

  initTrackEvent() {
    this.peerConnection?.addEventListener("track", (event) => {
      const [remoteStream] = event.streams;
      this.mediaService.remoteContainer.srcObject = remoteStream;
    });
  }

  async createOffer(onSuccess: any): Promise<any> {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }

    await this.addStreamToConnect();
    this.initTrackEvent();

    this.peerConnection
      .createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((offer: RTCSessionDescriptionInit) => {
        this.peerConnection?.setLocalDescription(offer);
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
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    await this.addStreamToConnect();
    this.initTrackEvent();

    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer),
    );

    this.peerConnection
      .createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
      .then((answerRes: any) => {
        this.peerConnection?.setLocalDescription(answerRes);
        return answerRes;
      })
      .then((answer: any) => {
        onSuccess(answer);
      })
      .catch((err) => console.log(err));
  }

  async handlerAnswer(answer: any, onSuccess: any) {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    const rTCSession = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(rTCSession);
    onSuccess(this.candidateQueue[0]);
  }

  onConnectClose(cb: any) {
    this.peerConnection?.addEventListener("close", () => {
      console.log("close connection");
      cb();
    });
  }
}
