import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface Configs {
    isShowingLiveChat: boolean
}

let initialState: Configs = {
    isShowingLiveChat: false
}

const persistedState = JSON.parse(localStorage.getItem("REDUX"))

if (persistedState){
    initialState = persistedState.configs
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
