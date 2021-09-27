import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import {YoutubeInfo} from "../core/ytdl";

interface TabState {
    tabs: YoutubeInfo[];
    activeTab: string;
}

type SetRecordingPayload = {
    youtubeId: string;
    recordingStatus: boolean;
}

let initialState: TabState = {
    tabs: [],
    activeTab: "home"
}

const persistedState = JSON.parse(localStorage.getItem("REDUX"))
if (persistedState){
    initialState = persistedState.tabs
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
                recording: recordingStatus
            })
        },
        chooseTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            if (state.activeTab === youtubeId){
                return
            }
            state.activeTab = youtubeId
        }
    }
})

export const { addTab, removeTab, chooseTab, setRecording } = tabSlice.actions
export const selectTabReducer = (state: RootState) => state.tabs
export default tabSlice.reducer
