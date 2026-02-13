declare module '*.js' {
  const content: any;
  export default content;
  export const mapDispatchToProps: any;
  export const numberWithCommas: any;
}

declare module '*.jsx' {
  import { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
