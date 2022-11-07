import React from "react";
import cx from "classnames";

import "./styles.css";

type IconWrapProps = {
  onClick: () => void;
  children: any;
  classes?: string;
  onlyMobile?: boolean;
};

export const IconWrap = ({
  onClick,
  children,
  classes,
  onlyMobile = true,
}: IconWrapProps) => {
  return (
    <button
      className={cx("circleBtn", { mobileVisibleFlex: onlyMobile }, classes)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
