import React from "react";
import { hot } from "react-hot-loader";

import { Chat } from "./containers/TextChat";

import "./styles.css";

function App() {
  return (
    <div className="app">
      <Chat />
    </div>
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);