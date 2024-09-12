import { Icons } from "../../assets/icons";
import styled, { CSSProperties } from "styled-components";

export type IconProps = {
  name: string;
  color?: string;
  inheritFill?: boolean;
  id?: string;
  style?: CSSProperties;
  className?: string;
};

type SVGProps = {
  color?: string;
  inheritFill?: boolean;
};

const SVG = styled.svg<SVGProps>`
  width: 16px;
  height: 16px;

  path {
    fill: ${({ color, inheritFill }) => {
      if (color) {
        return color;
      } else if (inheritFill) {
        return "inherit";
      } else {
        return "#000";
      }
    }};
  }
`;

export function Icon({
  name,
  color,
  id,
  style,
  className,
  inheritFill,
}: IconProps) {
  const foundIcon = Icons.find((i) => i.name === name);

  return (
    <SVG
      color={color}
      inheritFill={inheritFill}
      className={className}
      id={id}
      style={style}
      viewBox={"0 0 16 16"}
    >
      {foundIcon ? (
        foundIcon.paths?.map((d) => <path key={d} d={d} />)
      ) : (
        <path />
      )}
    </SVG>
  );
}
