import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter,Route,Switch} from "react-router-dom";
import Home from "./components/Home"
import TopBar from "./components/common/TopBar";

const App = () => {
    return <HashRouter>
        <TopBar/>
        <Switch>
            <Route exact path={"/"} component={Home}/>
        </Switch>
    </HashRouter>
}

const render = () => {
    ReactDOM.render(<App/>, document.body);
}

render();
