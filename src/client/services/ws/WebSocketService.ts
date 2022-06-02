import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { IWsMessage } from "./types";

interface WebSocketConfig {
  url: string;
}

type SubscribeStoreConfig = {
  name: string;
  cb: (data: any) => void;
};

export class WebSocketService {
  socket: WebSocketSubject<string> | null;
  url: string;
  onClose: any;

  constructor({ url }: WebSocketConfig) {
    this.url = url;
    this.socket = null;
    this.onClose = null;
  }

  init() {
    try {
      this.socket = webSocket({
        url: this.url,
        closeObserver: {
          next: (e) => {
            console.log(e);
            this.onClose && this.onClose(e);
          },
        },
      });
    } catch (e) {
      console.log("this.socket error", e);
    }
    const obs = this.socket?.multiplex(
      () => {
        return "sub";
      },
      () => {
        return "unsub";
      },
      () => true,
    );

    const sub = obs?.subscribe((msg: IWsMessage<any>): void => {
      this.req(msg);
    });

    return () => {
      sub?.unsubscribe();
    };
  }

  set close(onClose: any) {
    this.onClose = onClose;
  }

  send(msg: IWsMessage<any>): void {
    this.socket?.next(msg);
    console.log("message res", msg);
  }

  subscribeStore = ({ cb, name }: SubscribeStoreConfig) => {
    const obs = this.socket?.multiplex(
      () => {
        return `sub ${name}`;
      },
      () => {
        return `unsub ${name}`;
      },
      (msg: IWsMessage<any>) => {
        return msg.method === name;
      },
    );

    const sub = obs?.subscribe((data: any) => {
      cb(data);
    });

    return () => {
      sub?.unsubscribe();
    };
  };

  req(msg: IWsMessage<any>): void {
    // console.log("message", msg);
  }
}

export const wsService = new WebSocketService({
  url: "wss://192.168.3.19:8000",
});

export const destroy = wsService.init();
