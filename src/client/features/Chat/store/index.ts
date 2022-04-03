import { createEvent, createStore, createEffect } from "effector";

import { wsService } from "../../../services/ws";

export const sendUserMessageFx = createEffect((value: any) => {
  wsService.send(JSON.stringify(value));
});

const onMessagesUpdate = createEvent();

const updateMessagesListFx = createEffect();

updateMessagesListFx.use((data: any) => {
  console.log("response", data);
  return data;
});

// store fn
wsService.subscribeStore(onMessagesUpdate);

export const $messagesList = createStore([])
  .on(sendUserMessageFx.done, (_, messages) => {
    console.log("msg", messages);
  })
  .on(updateMessagesListFx.done, (_, list) => {
    console.log("res done", list);
  })
  .on(onMessagesUpdate, (state, list) => {
    return console.log("event try", state);
  });

$messagesList.watch((messages) => {
  console.log("change watch", messages);
});
