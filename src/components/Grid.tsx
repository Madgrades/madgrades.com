import React from 'react';

interface RowProps {
  children: React.ReactNode;
  center?: boolean;
  middle?: boolean;
  between?: boolean;
  [key: string]: any;
}

export const Row: React.FC<RowProps> = ({ children, center, middle, between, ...props }) => {
  const classNames = ['grid-row'];
  if (center) classNames.push('grid-row-center');
  if (middle) classNames.push('grid-row-middle');
  if (between) classNames.push('grid-row-between');

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  );
};

interface ColProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  auto?: boolean;
  [key: string]: any;
}

export const Col: React.FC<ColProps> = ({ children, xs, sm, md, lg, auto, ...props }) => {
  const classNames = ['grid-col'];

  if (xs) classNames.push(`grid-col-xs-${xs}`);
  if (sm) classNames.push(`grid-col-sm-${sm}`);
  if (md) classNames.push(`grid-col-md-${md}`);
  if (lg) classNames.push(`grid-col-lg-${lg}`);
  if (auto) classNames.push('grid-col-auto');

  // If no size specified, default to auto
  if (!xs && !sm && !md && !lg && !auto) {
    classNames.push('grid-col-auto');
  }

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  );
};
