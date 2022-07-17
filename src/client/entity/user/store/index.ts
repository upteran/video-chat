import { createEvent, createStore } from "effector";
import { createUser } from "../helpers";
import { setCookie, parseCookies, destroyCookie } from "nookies";

type UserState = {
  name: string;
  isLogin: boolean;
};

const cookie = parseCookies();

const initialState = {
  name: cookie?.chatUser || "",
  isLogin: !!cookie?.chatUser || false,
};

// events
export const createUserEvent = createEvent<string>("createUser");
export const logOutEvent = createEvent("logOut");

export const $userStore = createStore<UserState>(initialState)
  .on(createUserEvent, (state, name) => {
    return {
      name,
      isLogin: true,
    };
  })
  .on(logOutEvent, () => {
    return {
      name: "",
      isLogin: false,
    };
  });

createUserEvent.watch((name: string) => {
  if (name) {
    setCookie(null, "chatUser", name, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
});

logOutEvent.watch(() => {
  const cookie = parseCookies();
  if (cookie?.chatUser) {
    destroyCookie(null, "chatUser");
    destroyCookie(null, "chatToken");
  }
});
