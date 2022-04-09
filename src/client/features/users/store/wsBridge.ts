import { createEffect } from "effector";

import { wsService } from "../../../services/ws";
import { namespace } from "./events";

export const updateUserListBridgeFx = createEffect();

updateUserListBridgeFx.use((data: any) => {
  return data;
});

// store fn
wsService.subscribeStore({ name: namespace, cb: updateUserListBridgeFx });
