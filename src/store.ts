import {configureStore} from '@reduxjs/toolkit'
import tabReducer from "./reducers/tabs"
import configReducer from "./reducers/configs"

export const store = configureStore({
    reducer: {
        tabs: tabReducer,
        configs: configReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
