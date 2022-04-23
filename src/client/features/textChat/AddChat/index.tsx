import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";

interface IAddChatProps {
  openNewChatStep: () => unknown;
}

export const AddChat: React.FC<IAddChatProps> = ({ openNewChatStep }) => {
  const [chatLink, setChatLink] = useState<string>("");
  const onEnterChatClick = () => {
    console.log("create chat");
  };
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setChatLink(e.target.value);
  };
  const newChatClickHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    openNewChatStep();
  };
  return (
    <>
      <div className="font-sans mb-3.5">Enter chat link</div>
      <input
        className="input rounded-sm border-gray-200 hover:border-gray-400"
        type="text"
        value={chatLink}
        onChange={onInputChange}
      />
      <button
        className="group relative w-full flex justify-center align-middle py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2.5 mt-3.5"
        onClick={onEnterChatClick}
      >
        Enter
      </button>
      <a
        href="#"
        className="font-sans font-medium text-indigo-600 hover:text-indigo-500"
        onClick={newChatClickHandler}
      >
        or create new chat
      </a>
    </>
  );
};
