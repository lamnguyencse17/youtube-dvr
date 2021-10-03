import * as React from 'react';
import {useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import {COMING_LOG, RECEIVE_ERROR} from "./events";
import {toast, ToastContainer} from 'react-toastify';
import Player from "./components/Player";
import {Provider} from "react-redux";
import {store} from "./store";
import 'react-toastify/dist/ReactToastify.css';

const {ipcRenderer} = window.require('electron');

const App = () => {
    useEffect(() => {
        ipcRenderer.on(RECEIVE_ERROR, (event, err: string) => {
            toast(err)
        })
        ipcRenderer.on(COMING_LOG, (event, logData: string) => {
            console.log(logData)
        })
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
    ReactDOM.render(<Provider store={store}><App/></Provider>, document.body);
}

render();
