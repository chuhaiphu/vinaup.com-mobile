import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const VinaupUnlock = (props: SvgProps) => (
  <Svg width={16} height={18} viewBox="0 0 16 18" fill="none" {...props}>
    <Path
      d="M13.55 7.1499H2.35C1.46634 7.1499 0.75 7.86625 0.75 8.7499V15.1499C0.75 16.0336 1.46634 16.7499 2.35 16.7499H13.55C14.4337 16.7499 15.15 16.0336 15.15 15.1499V8.7499C15.15 7.86625 14.4337 7.1499 13.55 7.1499Z"
      stroke={props.color || '#121212'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.1499 7.15V3.15C3.1499 2.51348 3.40276 1.90303 3.85285 1.45294C4.30293 1.00286 4.91338 0.75 5.5499 0.75H10.3499C10.9864 0.75 11.5969 1.00286 12.047 1.45294C12.497 1.90303 12.7499 2.51348 12.7499 3.15V3.95"
      stroke={props.color || '#121212'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default VinaupUnlock;
