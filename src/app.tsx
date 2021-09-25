import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter,Route,Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar, {VideoTabTitle} from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {CHANGE_TITLES_LIST, RECEIVE_ERROR} from "./events";
const { ipcRenderer } = window.require('electron');
import { ToastContainer, toast } from 'react-toastify';
import Player from "./components/Player";
import {Provider} from "react-redux";
import {store} from "./store";

const App = () => {
    useEffect(() => {
        ipcRenderer.on(RECEIVE_ERROR, (event, err: string) => {
            console.log(err)
            toast(err);
        })
        ipcRenderer.on(CHANGE_TITLES_LIST, (event, titles: VideoTabTitle[]) => {
            setTopbarTitles(titles)
        })
    }, [])

    const [topbarTitles, setTopbarTitles] = useState<VideoTabTitle[]>([{title: "Kanata Race", youtubeId: "G5u6qEy5TW4"}])
    return <Provider store={store}>
        <HashRouter>
            <ThemeProvider theme={theme}>
                <TopBar titles={topbarTitles}/>
                <Switch>
                    <Route exact path={"/"} component={Home}/>
                    <Route path={"/player/:youtubeId"} component={Player}/>
                </Switch>
                <ToastContainer/>
            </ThemeProvider>
        </HashRouter>
    </Provider>
}

const render = () => {
    ReactDOM.render(<App/>, document.body);
}

render();
