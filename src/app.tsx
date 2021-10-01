import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {LOAD_STATE, RECEIVE_ERROR, RECORDING_STARTED, UNLOAD_WEB} from "./events";
const { ipcRenderer } = window.require('electron');
import { ToastContainer } from 'react-toastify';
import Player from "./components/Player";
import {Provider} from "react-redux";
import {RootState, store} from "./store";
import {useAppDispatch} from "./hooks";
import {replaceTabState} from "./reducers/tabs";
import {replaceConfigState} from "./reducers/configs";

const App = () => {
    const [unloadCalled, setUnload] = useState(false)
    const dispatch = useAppDispatch()
    useEffect(() => {
        ipcRenderer.on(RECEIVE_ERROR, (event, err: string) => {
            console.log(err)
        })
        ipcRenderer.send(LOAD_STATE)
        ipcRenderer.on(LOAD_STATE, (event, newState: RootState) => {
            if (!newState){
                return
            }
            dispatch(replaceTabState(newState.tabs))
            dispatch(replaceConfigState(newState.configs))
        })
        window.onbeforeunload = function (){
            if (!unloadCalled){
                const reduxState = store.getState()
                ipcRenderer.send(UNLOAD_WEB, reduxState)
                setUnload(true)
            }
        }
    }, [])
    return <HashRouter>
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Switch>
                <Route exact path={"/"} component={Home}/>
                <Route path={"/player/:youtubeId"} component={Player}/>
            </Switch>
            <ToastContainer/>
        </ThemeProvider>
    </HashRouter>
}

const render = () => {
    ReactDOM.render( <Provider store={store}><App/></Provider>, document.body);
}

render();
