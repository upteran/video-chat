import React from "react";
import { UserIcon } from "@heroicons/react/solid";

export const Icon = ({ onClick }) => {
  return (
    <button
      className="circleBtn mobileVisibleFlex"
      onClick={onClick}
    >
      <UserIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 icon" />
    </button>
  );
};
