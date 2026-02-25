import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const VinaupCalendarIcon = (props: SvgProps) => (
  <Svg width={25} height={27} viewBox="0 0 25 27" fill="none" {...props}>
    <Path
      d="M5.16669 3.77778V1M19.0556 3.77778V1"
      stroke={props.color || '#FCBE11'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.1111 3.77783H21.8333C22.5972 3.77783 23.2222 4.40283 23.2222 5.16672V24.6112C23.2222 25.3751 22.5972 26.0001 21.8333 26.0001H2.38889C1.625 26.0001 1 25.3751 1 24.6112V5.16672C1 4.40283 1.625 3.77783 2.38889 3.77783H12.1111Z"
      stroke={props.color || '#FCBE11'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.16669 10.7222H19.0556"
      stroke={props.color || '#FCBE11'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.16669 17.6667H14.8889"
      stroke={props.color || '#FCBE11'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default VinaupCalendarIcon;
