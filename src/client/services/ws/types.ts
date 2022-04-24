export type WsMessageType<T> = {
  id: string;
  method: string;
  payload: T;
};
