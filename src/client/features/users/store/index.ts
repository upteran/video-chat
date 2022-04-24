import { createEvent, createStore } from "effector";
import { createUser } from "../helpers";

type UserState = {
  name: string;
  isLogin: boolean;
};

const initialState = {
  name: "",
  isLogin: false,
};

export const createUserEvent = createEvent<string>("createUser");

export const $userStore = createStore<UserState>(initialState).on(
  createUserEvent,
  (state, name) => {
    return {
      name,
      isLogin: true,
    };
  },
);
