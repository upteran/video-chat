import React, { useState } from "react";
import { useStore } from "effector-react";
import cx from "classnames";
import { ClipboardCopyIcon } from "@heroicons/react/solid";

import { $chatStore } from "entity/chat/store";

import "./styles.css";

export const CopyClipboard = ({
  isMobile = false,
  classes = "",
}: {
  isMobile?: boolean;
  classes?: string;
}) => {
  const { chat } = useStore($chatStore);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const onCopyClick = async () => {
    try {
      // @ts-ignore
      await navigator.clipboard.writeText(chat?.chatId);
      setIsCopy(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      className={cx("copyBtn", { mobileVisibleFlex: isMobile }, classes)}
      onClick={onCopyClick}
    >
      <ClipboardCopyIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
      <span>{!isCopy ? "COPY CHAT LINK" : "LINK IS COPIED"}</span>
    </button>
  );
};
