import { webSocket, WebSocketSubject } from "rxjs/webSocket";

interface WebSocketConfig {
  url: string;
}

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
      (): any => {
        return "sub";
      },
      () => {
        return "unsub";
      },
      () => true,
    );

    const sub = obs?.subscribe((msg: string): any => {
      return this.req(msg);
    });

    return () => {
      sub?.unsubscribe();
    };
  }

  send(msg: any): void {
    this.socket?.next(msg);
    console.log("message res", msg);
  }

  subscribeStore = (store: any) => {
    const obs = this.socket?.multiplex(
      () => {
        return "sub1";
      },
      () => {
        return "unsub2";
      },
      (msg) => true,
    );

    const sub = obs?.subscribe((data: any) => {
      console.log("subscribe new");
      store(data);
    });

    return () => {
      sub?.unsubscribe();
    };
  };

  req(msg: any): void {
    console.log("message", msg);
  }
}

export const wsService = new WebSocketService({ url: "ws://localhost:8000" });

wsService.init();
