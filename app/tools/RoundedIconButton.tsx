import classNames from "classnames";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface IRoundedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}
export const RoundedIconButton: FC<IRoundedButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        "bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
