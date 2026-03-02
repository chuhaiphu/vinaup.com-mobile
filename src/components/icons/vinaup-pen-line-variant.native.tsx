import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const VinaupPenLineVariant = (props: SvgProps) => (
  <Svg
    width={13}
    height={13}
    viewBox="0 0 13 13"
    fill="none"
    {...props}
  >
    <Path
      d="M1.64706 8.87572L1 11.464L3.58824 10.8169L11.0851 3.32008C11.3277 3.07739 11.464 2.74829 11.464 2.40514C11.464 2.06198 11.3277 1.73288 11.0851 1.49019L10.9738 1.3789C10.7311 1.13629 10.402 1 10.0588 1C9.71567 1 9.38657 1.13629 9.14388 1.3789L1.64706 8.87572Z"
      stroke={props.color || "#005C62"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.35156 4.34644L3.33203 10.365L1.68652 10.7761L2.09766 9.13159L8.11719 3.11206L9.35156 4.34644Z"
      fill={props.color || "#005C62"}
      stroke={props.color || "#005C62"}
    />
    <Path
      d="M8.1176 2.40503L10.0588 4.34621M6.82349 11.4639H12"
      stroke={props.color || "#005C62"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)
export default VinaupPenLineVariant
