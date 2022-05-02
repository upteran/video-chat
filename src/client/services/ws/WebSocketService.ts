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

  constructor({ url }: WebSocketConfig) {
    this.url = url;
    this.socket = null;
  }

  init() {
    this.socket = webSocket(this.url);
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
  url: "ws://192.168.3.19:8000",
});

export const destroy = wsService.init();
