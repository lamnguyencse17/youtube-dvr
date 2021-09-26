import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type TabInfo = {
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
            state.activeTab = newTab.title
            console.log(state)
        },
        removeTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            state.activeTab = state.activeTab === youtubeId ? "home" : state.activeTab
            const newTabs = state.tabs.filter(tab => tab.youtubeId !== youtubeId);
            state.tabs = [...newTabs]
        },
        chooseTab: (state, action: PayloadAction<string>) => {
            const youtubeId = action.payload
            if (state.activeTab === youtubeId){
                return
            }
            state.activeTab = youtubeId
            if (state.tabs.filter(tab => tab.youtubeId === youtubeId).length === 0){
                state.tabs.push({title: "", youtubeId})
            }
        }
    }
})

export const { addTab, removeTab, chooseTab } = tabSlice.actions
export const selectTabReducer = (state: RootState) => state.tabs
export default tabSlice.reducer
