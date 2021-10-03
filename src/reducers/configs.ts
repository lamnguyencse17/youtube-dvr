import {createSlice} from '@reduxjs/toolkit'
import type {RootState} from '../store'

interface Configs {
    isShowingLiveChat: boolean
    isShowingDownloadInfo: boolean
}

const initialState: Configs = {
    isShowingLiveChat: false,
    isShowingDownloadInfo: false
}

export const configSlice = createSlice({
    name: "configs",
    initialState,
    reducers: {
        toggleShowingLiveChat: (state) => {
            state.isShowingLiveChat = !state.isShowingLiveChat
        },
        toggleShowingDownloadInfo: (state) => {
            state.isShowingDownloadInfo = !state.isShowingDownloadInfo
        },
    }
})

export const {toggleShowingLiveChat, toggleShowingDownloadInfo} = configSlice.actions
export const selectConfigReducer = (state: RootState) => state.configs
export default configSlice.reducer
