import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const VinaupPlusMinusMultiplyEqual = (props: SvgProps) => (
  <Svg viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      fill={props.color || '#F9F9F9'}
      d="M25 0v25H0V0h25ZM9.09 6.818V4.545H6.819v2.273H4.545v2.273h2.273v2.273h2.273V9.09h2.273V6.818H9.09Zm11.364 0h-6.818v2.273h6.819V6.818Zm-12.5 8.62-1.606-1.606-1.607 1.607 1.607 1.607-1.61 1.606 1.609 1.608 1.608-1.608L9.56 20.26l1.608-1.608-1.608-1.607 1.607-1.606-1.607-1.607-1.606 1.607Zm12.5-1.234h-6.818v2.273h6.819v-2.273Zm0 3.41h-6.818v2.272h6.819v-2.272Z"
    />
  </Svg>
);

export default VinaupPlusMinusMultiplyEqual;
