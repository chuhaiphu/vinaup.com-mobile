import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const VinaupLock = (props: SvgProps) => (
  <Svg width={17} height={18} viewBox="0 0 17 18" fill="none" {...props}>
    <Path
      d="M14.2237 6.64453H2.43421C1.50405 6.64453 0.75 7.39858 0.75 8.32874V15.0656C0.75 15.9957 1.50405 16.7498 2.43421 16.7498H14.2237C15.1538 16.7498 15.9079 15.9957 15.9079 15.0656V8.32874C15.9079 7.39858 15.1538 6.64453 14.2237 6.64453Z"
      stroke={props.color || '#DA1A1A'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.27637 3.27632C3.27637 2.6063 3.54253 1.96372 4.01631 1.48994C4.49008 1.01616 5.13266 0.75 5.80268 0.75H10.8553C11.5253 0.75 12.1679 1.01616 12.6417 1.48994C13.1155 1.96372 13.3816 2.6063 13.3816 3.27632V6.64474H3.27637V3.27632Z"
      stroke={props.color || '#DA1A1A'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default VinaupLock;
