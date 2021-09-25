import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type TabInfo = {
    title: string;
    youtubeId: string;
}

interface TabState {
    tabs: TabInfo[];
    activeTab: string;
}

const initialState: TabState = {
    tabs: [],
    activeTab: "home"
}

export const tabSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<TabInfo>) => {
            const newTab = action.payload
            state.tabs = [...state.tabs, newTab]
        },
        removeTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            state.activeTab = state.activeTab === youtubeId ? "home" : state.activeTab
            const newTabs = state.tabs.filter(tab => tab.youtubeId !== youtubeId);
            state.tabs = [...newTabs]
        },
    }
})

export const { addTab, removeTab } = tabSlice.actions
export const selectTabReducer = (state: RootState) => state.tabs
export default tabSlice.reducer
