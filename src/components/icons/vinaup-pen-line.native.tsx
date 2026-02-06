import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const VinaupPenLine = (props: SvgProps) => (
  <Svg viewBox="0 0 13 13" fill="none" {...props}>
    <Path
      d="M7.75983 11.9216H12.2973M0.5 11.9216L3.80172 11.2563C3.977 11.221 4.13794 11.1347 4.26434 11.0082L11.6556 3.61296C12.0099 3.25839 12.0097 2.68366 11.655 2.32939L10.0893 0.765433C9.73477 0.411312 9.16033 0.411553 8.8061 0.765972L1.41411 8.16202C1.28796 8.28824 1.20182 8.44885 1.16647 8.62377L0.5 11.9216Z"
      stroke={props.color || '#005C62'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
