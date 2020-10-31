import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import Autorization from "./components/main/Authorization";
import ScrumTable from "./components/main/ScrumTable";
import {createBrowserHistory} from 'history';
import s from "./App.module.css";
import { rootReducer } from "./redux/rootReducer";

const store = createStore(rootReducer);

function App() {
  const history = createBrowserHistory()
  return (
    <Router>
      <div className={s.root}>
        <Switch>
          <Route path="/table">
            <ScrumTable />
          </Route>
          <Route path="/">
            <Autorization/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
