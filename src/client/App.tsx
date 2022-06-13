import React from "react";
import { hot } from "react-hot-loader";
import { useStore } from "effector-react";
import { LoadStateStatus } from "./features/chat/consts";
import { Chat } from "./screen/Chat";
// import { ErrorNotify } from "./errors/notify";
import { LogIn } from "./screen/LogIn";
import { $chatStore } from "./features/chat/store";

import "./styles.css";

function App() {
  const { loadedState } = useStore($chatStore);
  return (
    <div className="app">
      <div className="">
        <div className="wrap">
          {loadedState === LoadStateStatus.loaded ? <Chat /> : <LogIn />}
        </div>
      </div>
      {/*<ErrorNotify />*/}
    </div>
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
