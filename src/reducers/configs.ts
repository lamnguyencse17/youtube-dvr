import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../store'

interface Configs {
    isShowingLiveChat: boolean
}

let initialState: Configs = {
    isShowingLiveChat: false
}

const persistedState = JSON.parse(localStorage.getItem("REDUX"))

if (persistedState) {
    initialState = persistedState.configs
}

export const configSlice = createSlice({
    name: "configs",
    initialState,
    reducers: {
        toggleShowingLiveChat: (state) => {
            state.isShowingLiveChat = !state.isShowingLiveChat
        },
        replaceConfigState: (state, action: PayloadAction<Configs>) => {
            if (action.payload != null) {
                state = {...action.payload}
            }
        }
    }
})

export const {toggleShowingLiveChat, replaceConfigState} = configSlice.actions
export const selectConfigReducer = (state: RootState) => state.configs
export default configSlice.reducer
