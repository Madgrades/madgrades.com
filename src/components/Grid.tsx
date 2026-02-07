import React from "react";
import "../styles/components/Grid.css";

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  center?: boolean;
  middle?: boolean;
  between?: boolean;
}

export const Row: React.FC<RowProps> = ({ children, center, middle, between, ...props }) => {
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

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number;
  lg?: number;
  auto?: boolean;
}

export const Col: React.FC<ColProps> = ({ children, xs, sm, md, lg, auto, ...props }) => {
  const classNames = ["grid-col"];

  if (typeof xs === 'number') {
    classNames.push(`grid-col-xs-${xs}`);
  }
  if (typeof sm === 'number') {
    classNames.push(`grid-col-sm-${sm}`);
  }
  if (md) classNames.push(`grid-col-md-${md}`);
  if (lg) classNames.push(`grid-col-lg-${lg}`);
  if (auto) classNames.push("grid-col-auto");

  // If xs or sm is true (boolean), treat as flexible column
  if ((xs === true || sm === true) && !auto) {
    classNames.push("grid-col-auto");
  }

  // Default to auto if no sizing specified
  if (!xs && !sm && !md && !lg && !auto) {
    classNames.push("grid-col-auto");
  }

  return (
    <div className={classNames.join(" ")} {...props}>
      {children}
    </div>
  );
};
