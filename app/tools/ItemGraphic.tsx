import classNames from "classnames";
import { FC, useEffect, useRef } from "react";

interface IItemProps {
  name: string;
  canvas?: HTMLCanvasElement;
  className?: string;
  imageUrl?: string;
  hideGraphic?: boolean;
}
export const ItemGraphic: FC<IItemProps> = ({
  imageUrl,
  canvas,
  name,
  hideGraphic,
  className,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && canvas) {
      ref.current.appendChild(canvas);
    }

    return () => canvas?.remove();
  }, [ref.current, canvas]);

  return (
    <div
      className={classNames(
        "relative h-full w-full flex flex-col justify-between items-center shadow-md p-3 bg-white hover:bg-gray-50",
        className
      )}
    >
      <div
        ref={ref}
        className={classNames("pointer-events-none w-full shrink", {
          "opacity-0": hideGraphic,
        })}
      >
        {imageUrl && <img src={imageUrl} alt={name} />}
      </div>

      <div className="w-[90%] text-center shrink-0 text-xs italic overflow-hidden text-ellipsis whitespace-nowrap">
        {name}
      </div>
    </div>
  );
};
