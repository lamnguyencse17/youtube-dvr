import { StreamStatType } from "electron/preload";
import { createContext } from "react";

export const StreamContext = createContext<StatContextType>({
  streams: {},
  setSingleStream: () => {},
});

export type StatType = {
  [key: string]: StreamStatType | undefined;
};

export type StatContextType = {
  streams: StatType;
  setSingleStream: (id: string, value: StreamStatType) => void;
};
