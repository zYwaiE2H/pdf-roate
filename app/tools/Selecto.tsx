import ReactSelecto from "react-selecto";

interface ISelectoProps {
  indexAttrProp: string;
  ignoreClass: string;
  container: HTMLElement | null | undefined;
  selectableTargets: string[];
  onChange(index: number, type: "remove" | "add"): void;
}
export function Selecto({
  indexAttrProp,
  ignoreClass,
  container,
  selectableTargets,
  onChange,
}: ISelectoProps) {
  return (
    <ReactSelecto
      container={container}
      boundContainer={container}
      dragContainer={container}
      selectableTargets={selectableTargets}
      selectByClick={false}
      selectFromInside={true}
      continueSelect={false}
      toggleContinueSelect={"shift"}
      keyContainer={window}
      hitRate={50}
      onSelect={(e) => {
        if (
          e.inputEvent.type === "mousedown" &&
          e.inputEvent.target.closest(ignoreClass)
        ) {
          return;
        }
        e.removed.forEach(($el) => {
          const index = $el.getAttribute(indexAttrProp);

          if (index) {
            onChange(Number(index), "remove");
          }
        });
        e.added.forEach(($el) => {
          const index = $el.getAttribute(indexAttrProp);

          if (index) {
            onChange(Number(index), "add");
          }
        });
      }}
    />
  );
}
