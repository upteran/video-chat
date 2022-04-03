/* eslint-ignore */
import React, { useState } from "react";
import { MessagesList, Message } from "../types";

import "./styles.scss";

export const MessagesView = () => {
  const messages: any = [];
  return (
    <div className="messages">
      {messages.map(({ text, id }: Message) => (
        <div key={id}>{text}</div>
      ))}
    </div>
  );
};
