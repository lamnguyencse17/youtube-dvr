import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter,Route,Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import {useEffect} from "react";
import {RECEIVE_ERROR} from "./events";
const { ipcRenderer } = window.require('electron');
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
    useEffect(() => {
        ipcRenderer.on(RECEIVE_ERROR, (event, err: string) => {
            console.log(err)
            toast(err);
        })
    }, [])
    return <HashRouter>
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Switch>
                <Route exact path={"/"} component={Home}/>
            </Switch>
            <ToastContainer/>
        </ThemeProvider>
    </HashRouter>
}

const render = () => {
    ReactDOM.render(<App/>, document.body);
}

render();
