import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

type ButtonElement = {
  width?: string;
  textColor?: string;
  backgroundColor?: string;
};

const ButtonElement = styled.button<ButtonElement>`
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  position: relative;
  cursor: pointer;
  text-align: center;
  line-height: normal;
  white-space: nowrap;
  margin: 0;
  padding: 10px 12px;
  width: ${(props) => props.width ?? "100%"};
  color: ${(props) => props.textColor ?? "#fff"};
  background: ${(props) => props.backgroundColor ?? "#ff612f"};
  font-family: var(--sans);
  font-weight: 500;
  font-style: normal;
  font-size: 16px;
  border-radius: 4px;
  border: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ButtonLeftIcon = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-right: 7px;
`;

const ButtonRightIcon = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-left: 7px;
`;

const SpinnerOverlay = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const HideContents = styled.span`
  visibility: hidden;
`;

export type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type CustomButtonProps = {
  loading?: boolean;
  width?: string;
  textColor?: string;
  backgroundColor?: string;
  leftIcon?: string;
  rightIcon?: string;
  children?: ReactNode;
};

export type ButtonProps = CustomButtonProps & NativeButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      loading,
      textColor,
      backgroundColor,
      leftIcon,
      rightIcon,
      children,
      ...rest
    } = props;

    const buttonContents = (
      <>
        {leftIcon ? (
          <ButtonLeftIcon>
            <Icon name={leftIcon} color={"#fff"} />
          </ButtonLeftIcon>
        ) : null}
        {children}
        {rightIcon ? (
          <ButtonRightIcon>
            <Icon name={rightIcon} color={"#fff"} />
          </ButtonRightIcon>
        ) : null}
      </>
    );

    const buttonLoading = (
      <>
        <SpinnerOverlay>
          <Spinner />
        </SpinnerOverlay>
        <HideContents>{buttonContents}</HideContents>
      </>
    );

    return (
      <ButtonElement
        ref={ref}
        backgroundColor={backgroundColor}
        textColor={textColor}
        {...rest}
      >
        {loading ? buttonLoading : buttonContents}
      </ButtonElement>
    );
  }
);
