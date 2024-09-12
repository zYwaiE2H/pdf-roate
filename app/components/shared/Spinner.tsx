import classNames from "classnames";
import { FC } from "react";
import styled, { keyframes } from "styled-components";

const SpinnerKeyframes = keyframes`
  to { -webkit-transform: rotate(360deg); }
`;

const SpinnerElement = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  animation-name: ${SpinnerKeyframes};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  border: 3px solid;
  transition: 0.2s;
`;

interface IProps {
  color?: 'black' | 'white'
}
export const Spinner: FC<IProps> = ({
  color
}) => {
  return <SpinnerElement className={classNames({
    '!border-white/30 !border-t-white': color === undefined || color === 'white',
    '!border-black/30 !border-t-black': color === undefined || color === 'black',
  })}/>;
};
