// ResizablePanelContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  RefObject,
  useEffect,
} from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

interface ResizablePanelContextProps {
  sizes: number[];
  setSizes: (sizes: number[]) => void;
  panelRef: RefObject<ImperativePanelHandle>;
  panelSize: number;
  setPanelSize: (size: number) => void;
}

const ResizablePanelContext = createContext<
  ResizablePanelContextProps | undefined
>(undefined);

export const ResizablePanelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sizes, setSizes] = useState<number[]>([]);
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [panelSize, setPanelSize] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (panelRef.current) {
        setPanelSize(panelRef.current.getSize());
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [panelRef]);

  return (
    <ResizablePanelContext.Provider
      value={{ sizes, setSizes, panelRef, panelSize, setPanelSize }}
    >
      {children}
    </ResizablePanelContext.Provider>
  );
};

export const useResizablePanel = () => {
  const context = useContext(ResizablePanelContext);
  if (!context) {
    throw new Error(
      "useResizablePanel must be used within a ResizablePanelProvider",
    );
  }
  return context;
};
