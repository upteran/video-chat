import React, { useState } from "react";
import cx from "classnames";

import { AddUser } from "../../features/users/AddUser";
import { AddChat } from "../../features/textChat/AddChat";

import "./styles.css";

const steps = {
  NEW_CHAT: "newChat",
  CONNECT: "connect",
};

export const LogIn = () => {
  const [step, setStep] = useState(steps.CONNECT);
  const openNewChatStep = () => setStep(steps.NEW_CHAT);
  return (
    <div className="logInWrapper shadow-lg border-gray-200 bg-zinc-100">
      {step === steps.CONNECT ? (
        <AddChat openNewChatStep={openNewChatStep} />
      ) : (
        <AddUser />
      )}
    </div>
  );
};
