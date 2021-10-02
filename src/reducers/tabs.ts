import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../store'
import {StartRecordingPayload, YoutubeInfo} from "../core/ytdl";
import {START_RECORDING, STOP_RECORDING} from "../events";

const {ipcRenderer} = window.require('electron');

interface TabState {
    tabs: YoutubeInfo[];
    activeTab: string;
}

type SetRecordingPayload = {
    youtubeId: string;
    recordingStatus: boolean;
}

const initialState: TabState = {
    tabs: [],
    activeTab: "home"
}

export const tabSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<YoutubeInfo>) => {
            const newTab = action.payload
            state.tabs = [...state.tabs, newTab]
            state.activeTab = newTab.title
        },
        removeTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            state.activeTab = state.activeTab === youtubeId ? "home" : state.activeTab
            const newTabs = state.tabs.filter(tab => tab.youtubeId !== youtubeId);
            state.tabs = [...newTabs]
        },
        setRecording: (state, action: PayloadAction<SetRecordingPayload>) => {
            const {youtubeId, recordingStatus} = action.payload
            Object.assign(state.tabs.find(tab => tab.youtubeId === youtubeId), {
                isRecording: recordingStatus
            })
        },
        chooseTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            if (state.activeTab === youtubeId) {
                return state
            }
            state.activeTab = youtubeId
        },
        replaceTabState: (state, action: PayloadAction<TabState>) => {
            if (action.payload != null) {
                return {...action.payload}
            }
        },
        stopRecording: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            ipcRenderer.send(STOP_RECORDING, youtubeId)
            Object.assign(state.tabs.find(tab => tab.youtubeId === youtubeId), {
                isRecording: false
            })
        },
        startRecording: (state, action: PayloadAction<StartRecordingPayload>) => {
            const {youtubeId, filePath} = action.payload
            ipcRenderer.send(START_RECORDING, {youtubeId, filePath})
            Object.assign(state.tabs.find(tab => tab.youtubeId === youtubeId), {
                isRecording: true
            })
        }
    }
})

export const {
    addTab,
    removeTab,
    chooseTab,
    setRecording,
    replaceTabState,
    stopRecording,
    startRecording
} = tabSlice.actions
export const selectTabReducer = (state: RootState) => state.tabs
export default tabSlice.reducer
