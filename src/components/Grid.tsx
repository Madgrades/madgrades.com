import React from 'react';

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  center?: boolean;
  middle?: boolean;
  between?: boolean;
}

export function Row({ children, center, middle, between, ...props }: RowProps) {
  const classNames = ['grid-row'];
  if (center) {
    classNames.push('grid-row-center');
  }
  if (middle) {
    classNames.push('grid-row-middle');
  }
  if (between) {
    classNames.push('grid-row-between');
  }

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  );
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  auto?: boolean;
}

export function Col({ children, xs, sm, md, lg, auto, ...props }: ColProps) {
  const classNames = ['grid-col'];

  if (xs) {
    classNames.push(`grid-col-xs-${String(xs)}`);
  }
  if (sm) {
    classNames.push(`grid-col-sm-${String(sm)}`);
  }
  if (md) {
    classNames.push(`grid-col-md-${String(md)}`);
  }
  if (lg) {
    classNames.push(`grid-col-lg-${String(lg)}`);
  }
  if (auto) {
    classNames.push('grid-col-auto');
  }

  // If no size specified, default to auto
  if (!xs && !sm && !md && !lg && !auto) {
    classNames.push('grid-col-auto');
  }

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  );
}
