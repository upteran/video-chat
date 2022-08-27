import React from "react";
import { hot } from "react-hot-loader";
import { connect } from "effector-react";
import { LoadStateStatus } from "./entity/chat/consts";
import { Chat } from "./screen/Chat";
// import { ErrorNotify } from "./errors/notify";
import { LogIn } from "./screen/LogIn";
import { $chatStore } from "./entity/chat/store";
import { AppError } from "./errors/screens/appError";
// import { logOutEvent } from "entity/user/store";

import "./styles.css";

type AppState = {
  hasError: boolean;
};

type AppProps = {
  loadedState: LoadStateStatus;
};

class App extends React.Component<AppProps, AppState> {
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", function () {
      // logOutEvent();
    });
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Caught client error", error);
  }

  state = {
    hasError: false,
  };
  // const { loadedState } = useStore($chatStore);
  render() {
    const { hasError } = this.state;
    const { loadedState } = this.props;
    if (hasError) return <AppError />;
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
}

const AppProvider = connect($chatStore)(App);

declare let module: Record<string, unknown>;

export default hot(module)(AppProvider);
