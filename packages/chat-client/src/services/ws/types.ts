export type IWsMessage<T> = {
  id: string;
  method: string;
  payload: T;
};
