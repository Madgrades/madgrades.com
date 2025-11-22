import React from "react";
import "../styles/components/Grid.css";

export const Row = ({ children, center, middle, between, ...props }) => {
  const classNames = ["grid-row"];
  if (center) classNames.push("grid-row-center");
  if (middle) classNames.push("grid-row-middle");
  if (between) classNames.push("grid-row-between");

  return (
    <div className={classNames.join(" ")} {...props}>
      {children}
    </div>
  );
};

export const Col = ({ children, xs, sm, md, lg, auto, ...props }) => {
  const classNames = ["grid-col"];

  if (xs) classNames.push(`grid-col-xs-${xs}`);
  if (sm) classNames.push(`grid-col-sm-${sm}`);
  if (md) classNames.push(`grid-col-md-${md}`);
  if (lg) classNames.push(`grid-col-lg-${lg}`);
  if (auto) classNames.push("grid-col-auto");

  // If no size specified, default to auto
  if (!xs && !sm && !md && !lg && !auto) {
    classNames.push("grid-col-auto");
  }

  return (
    <div className={classNames.join(" ")} {...props}>
      {children}
    </div>
  );
};
