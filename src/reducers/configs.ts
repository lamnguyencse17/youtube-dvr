import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface Configs {
    isShowingLiveChat: boolean
}

const initialState: Configs = {
    isShowingLiveChat: false
}

export const configSlice = createSlice({
    name: "configs",
    initialState,
    reducers: {
        toggleShowingLiveChat: (state) => {
            state.isShowingLiveChat = !state.isShowingLiveChat
        }
    }
})

export const { toggleShowingLiveChat } = configSlice.actions
export const selectConfigReducer = (state: RootState) => state.configs
export default configSlice.reducer
