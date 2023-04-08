import { Svg, G, Rect, Path, Circle } from "react-native-svg";

import Dominoes from "../constants/Dominoes";
import { DominoProps } from "../types";

const Domino = ({
  top,
  bottom,
  rotation,
  height,
  width,
  backgroundColor,
  color,
  blank,
}: DominoProps) => {
  return (
    <Svg
      rotation={
        (Dominoes.findIndex(
          (e) => e.x !== top && e.y !== bottom && e.x === bottom && e.y === top
        ) !== -1
          ? 180
          : 0) + (rotation ?? 0)
      }
      viewBox="0 0 500 1000"
      height={height ?? 100}
      width={width ?? 50}
    >
      <G stroke="#000" strokeWidth={5} transform="translate(0 -52.362)">
        <Rect
          stroke-linejoin="round"
          fill-rule="evenodd"
          rx="50"
          ry="50"
          height="972.48"
          width="472.48"
          y="66.121"
          x="13.759"
          stroke-width="27.517"
          fill={backgroundColor ?? "#fff"}
        />
        {!blank && <Path stroke-width="20px" fill="none" d="m45 552.36h410" />}
      </G>
      {!blank && (
        <G transform="translate(0 -52.362)">
          {Dominoes.find(
            (e) =>
              (e.x === top && e.y === bottom) || (e.x === bottom && e.y === top)
          ).coordinates.map((c, i) => (
            <Circle key={i} cy={c.cy} cx={c.cx} r="50" fill={color ?? "#000"} />
          ))}
        </G>
      )}
    </Svg>
  );
};

export default Domino;
