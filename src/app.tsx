import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, useHistory} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {RECEIVE_ERROR, RECORDING_STARTED} from "./events";
const { ipcRenderer } = window.require('electron');
import { ToastContainer, toast } from 'react-toastify';
import Player from "./components/Player";
import {Provider} from "react-redux";
import {store} from "./store";
import {useAppDispatch} from "./hooks";
import {setRecording} from "./reducers/tabs";

const App = () => {
    const [unloadCalled, setUnload] = useState(false)
    const dispatch = useAppDispatch()
    useEffect(() => {
        ipcRenderer.on(RECEIVE_ERROR, (event, err: string) => {
            console.log(err)
            toast(err);
        })
        ipcRenderer.on(RECORDING_STARTED, (event, youtubeId: string) => {
            dispatch(setRecording({youtubeId, recordingStatus: true}))
        })
        window.onbeforeunload = function (){
            if (!unloadCalled){
                const reduxState = store.getState()
                console.log(reduxState)
                localStorage.setItem("REDUX", JSON.stringify(reduxState))
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
