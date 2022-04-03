export type WsMessageType<T> = {
  id: string;
  namespace: string;
  method: string;
  params: T;
};
