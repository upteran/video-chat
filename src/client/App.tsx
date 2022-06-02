import React from "react";
import { hot } from "react-hot-loader";
import { useStore } from "effector-react";

import { Chat } from "./screen/Chat";
// import { ErrorNotify } from "./errors/notify";
import { LogIn } from "./screen/LogIn";
import { $chatStore } from "./features/chat/store";

import "./styles.css";

function App() {
  const { isLoaded } = useStore($chatStore);
  return (
    <div className="app">
      <div className="">
        <div className="wrap">{isLoaded ? <Chat /> : <LogIn />}</div>
      </div>
      {/*<ErrorNotify />*/}
    </div>
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
