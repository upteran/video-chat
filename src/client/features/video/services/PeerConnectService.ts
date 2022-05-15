const conf = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// TODO: add types
export class PeerConnectService {
  peerConnection: null | RTCPeerConnection;
  config: any;
  iceSend: boolean;
  candidateQueue: Array<RTCIceCandidateInit>;
  onConnect: ((ev: any) => void) | null;

  constructor(config: any) {
    this.config = config;
    this.peerConnection = null;
    this.iceSend = false;
    this.candidateQueue = [];
    this.onConnect = null;
  }

  get isInit() {
    return !!this.peerConnection;
  }

  init(onConnect: any) {
    // this.config use
    this.peerConnection = new RTCPeerConnection(conf);
    this.onConnect = onConnect;
    // this.peerConnection.addTrack(MediaStreamTrack);
    this.msgLocalICEHandler();
    this.connectionStatusListener();
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

  msgICEHandler = async (message: RTCIceCandidate) => {
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

  async getOffer(onSuccess: any): Promise<any> {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    this.peerConnection
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) => {
        this.peerConnection?.setLocalDescription(offer);
        return offer;
      })
      .then((offer: RTCSessionDescriptionInit) => {
        onSuccess(offer);
      });
  }

  async handleOffer(
    offer: RTCSessionDescription,
    onSuccess: any,
  ): Promise<any> {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer),
    );
    let answer;
    this.peerConnection
      .createAnswer()
      .then((answerRes: any) => {
        answer = answerRes;
        alert(answer);
        this.peerConnection?.setLocalDescription(answerRes);
        return answer;
      })
      .then((answer: any) => {
        onSuccess(answer);
      });
  }

  async handlerAnswer(answer: any, onSuccess: any) {
    if (!this.peerConnection) {
      throw new Error("peerConnection must be init");
    }
    const rTCSession = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(rTCSession);
    onSuccess(this.candidateQueue[0]);
  }
}
