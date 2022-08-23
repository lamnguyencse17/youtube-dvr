import { ProgressData } from "electron/preload";
import { createContext } from "react";

export const ProgressContext = createContext<ProgressContextType>({
  progresses: {},
  setProgress: () => {},
});

export type ProgressType = {
  [key: string]: ProgressValueType | undefined;
};

export type ProgressValueType = {
  id: string;
  isRecording: boolean;
} & ProgressData;

export type ProgressContextType = {
  progresses: ProgressType;
  setProgress: (id: string, value: ProgressValueType) => void;
};
