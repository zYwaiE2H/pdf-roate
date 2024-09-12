import classNames from "classnames";
import { FC, useRef, useState } from "react";
import { FaUpload } from "../components/shared/FaIcons";

interface IFileDropProps {
  accept?: string;
  multiple?: boolean;
  onFileChange: (files: FileList) => void;
}

export const FileDrop: FC<IFileDropProps> = ({
  accept,
  multiple,
  onFileChange,
}) => {
  const [showFileDrop, setShowFileDrop] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className="h-[350px] relative text-center w-[275px]"
      onDragEnter={() => setShowFileDrop(true)}
    >
      {showFileDrop && (
        <div
          className="absolute w-full h-full rounded-sm top-0 right-0 left-0 bottom-0 cursor-pointer z-30"
          onDragLeave={() => setShowFileDrop(false)}
          onDragOver={(ev) => {
            ev.preventDefault();
            return false;
          }}
          onDrop={(ev) => {
            setShowFileDrop(false);
            onFileChange(ev.dataTransfer.files);
            ev.preventDefault();
            return false;
          }}
        ></div>
      )}
      <input
        ref={ref}
        className="cursor-pointer hidden"
        type="file"
        id="input-file-upload"
        multiple={multiple}
        accept={accept ?? ".pdf"}
        onChange={(ev) => {
          if (ev.target.files !== null) {
            onFileChange(ev.target.files);
            ref.current!.value = "";
          }
        }}
      />
      <label
        className={classNames(
          "h-full flex items-center justify-center border rounded transition-all",
          {
            "bg-white border-dashed border-stone-300": !showFileDrop,
            "bg-stone-100 border-stone-200 border-solid": showFileDrop,
          }
        )}
        htmlFor="input-file-upload"
      >
        <div className="cursor-pointer flex flex-col items-center space-y-3">
          <FaUpload className="w-8 h-8" />
          <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75">
            Click to upload or drag and drop
          </p>
        </div>
      </label>
    </div>
  );
};
