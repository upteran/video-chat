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
  isConnect: boolean;
  notSendMsg: IWsMessage<any>[];
  reconnectTimer: any;
  subscribers: Map<string, any>;
  isReconnect: boolean;

  constructor({ url }: WebSocketConfig) {
    this.url = url;
    this.socket = null;
    this.onClose = null;
    this.notSendMsg = [];
    this.isConnect = false;
    this.reconnectTimer = null;
    this.subscribers = new Map();
    this.isReconnect = false;
  }

  init() {
    try {
      this.socket = webSocket({
        url: this.url,
        closeObserver: {
          next: (e) => {
            console.log("WS connect was closed", e);
            if (this.isConnect) {
              this.isReconnect = true;
            }
            this.isConnect = false;
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = setInterval(() => {
              this.init();
            }, 2000);
            this.onClose && this.onClose(e);
          },
        },
        openObserver: {
          next: (e) => {
            console.log("WS connect was opened", e);
            if (this.isReconnect) {
              this.subscribers.forEach((cb, name) => {
                this.subscribeStore({ cb, name });
              });
            }
            this.isReconnect = false;
            this.isConnect = true;
            clearInterval(this.reconnectTimer);
            this.resendMsg();
          },
        },
      });
      const obs = this.socket?.multiplex(
        () => {
          return "sub";
        },
        () => {
          return "unsub";
        },
        () => true,
      );

      // @ts-ignore
      const sub = obs?.subscribe((msg: IWsMessage<any>): void => {
        this.req(msg);
      });

      return () => {
        sub?.unsubscribe();
      };
    } catch (e) {
      console.log("this.socket error", e);
    }
  }

  resendMsg() {
    if (this.notSendMsg.length) {
      this.notSendMsg.forEach((msg) => {
        console.log(msg);
        this.send(msg);
      });
    }
  }

  set close(onClose: any) {
    this.onClose = onClose;
  }

  send(msg: IWsMessage<any>): void {
    if (!this.isConnect) {
      this.notSendMsg.push(msg);
    }
    // @ts-ignore
    this.socket?.next(msg);
    console.log("message res", msg);
  }

  subscribeStore = ({ cb, name }: SubscribeStoreConfig) => {
    if (!this.socket) return;

    const obs = this.socket.multiplex(
      () => {
        return `sub ${name}`;
      },
      () => {
        return `unsub ${name}`;
      },
      // @ts-ignore
      (msg: IWsMessage<any>) => {
        return msg.method === name;
      },
    );

    const sub = obs.subscribe((data: any) => {
      cb(data);
    });

    this.subscribers.set(name, cb);

    return () => {
      sub?.unsubscribe();
      this.subscribers.delete(name);
    };
  };

  req(msg: IWsMessage<any>): void {
    // console.log("message", msg);
  }
}

export const wsService = new WebSocketService({
  url: `wss://${process.env.WS_HOST}${
    process.env.WS_PORT ? `:${process.env.WS_PORT}` : ""
  }`,
});

export const destroy = wsService.init();
