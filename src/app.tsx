import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter,Route,Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";
import theme from "./theme";
import {ThemeProvider} from "@mui/material";

const App = () => {
    return <HashRouter>
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Switch>
                <Route exact path={"/"} component={Home}/>
            </Switch>
        </ThemeProvider>
    </HashRouter>
}

const render = () => {
    ReactDOM.render(<App/>, document.body);
}

render();
