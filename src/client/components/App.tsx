import React, { useState } from "react";
import { hot } from "react-hot-loader";

import { Chat } from "../features/Chat";

// import "../../assetscss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <div className="app">
        <Chat />
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
