/* eslint-disable */
const conf = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  },
};

// TODO: add types
export class PeerConnectService {
  peerConnection: any;
  config: any;
  iceSend: boolean;
  candidateQueue: Array<any>;
  iceCb: any;
  // signalingChannel: any;

  constructor(config: any) {
    this.config = config;
    this.peerConnection = null;
    this.iceSend = false;
    this.candidateQueue = [];
    this.iceCb = null;
  }

  get isInit() {
    return !!this.peerConnection;
  }

  init(connectCb: any, iceCb: any) {
    // this.config use
    this.peerConnection = new RTCPeerConnection(conf);
    // this.peerConnection.addTrack(MediaStreamTrack);
    this.iceCb = iceCb;
    this.msgLocalICEHandler(iceCb);
    this.connectionStatusListener(connectCb);
  }

  connectionStatusListener = (cb: (arg: any) => void) => {
    this.peerConnection.addEventListener(
      "connectionstatechange",
      (event: any) => {
        if (this.peerConnection.connectionState === "connected") {
          console.log("Connection establish!");
          cb(event);
        }
      },
    );
  };

  msgLocalICEHandler = (iceCb: any) => {
    this.peerConnection.addEventListener("icecandidate", (event: any) => {
      if (event.candidate && !this.iceSend) {
        this.iceSend = true;
        if (!this.peerConnection.remoteDescription) {
          this.candidateQueue.push(event.candidate);
          console.log("Add to queue candidate ICE!");
        } else {
          iceCb(event.candidate);
          console.log("Send candidate ICE!");
        }
      }
    });
  };

  msgICEHandler = async (message: any) => {
    if (message) {
      try {
        console.log("inner", message);
        await this.peerConnection.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  };

  async getOffer(cb: any): Promise<any> {
    this.peerConnection
      .createOffer()
      .then((offer: any) => {
        this.peerConnection.setLocalDescription(offer);
        return offer;
      })
      .then((offer: any) => {
        cb(offer);
      });
  }

  async handleOffer(offer: any, cb: any): Promise<any> {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    let answer;
    this.peerConnection
      .createAnswer()
      .then((answerRes: any) => {
        answer = answerRes;
        alert(answer);
        this.peerConnection.setLocalDescription(answerRes);
        return answer;
      })
      .then((answer: any) => {
        cb(answer);
      });
  }

  async handlerAnswer(answer: any) {
    const rTCSession = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(rTCSession);
    this.iceCb(this.candidateQueue[0]);
  }
}
