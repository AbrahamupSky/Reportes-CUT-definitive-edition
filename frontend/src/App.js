import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { About } from './components/About'
import { Xbarra } from './components/navbar'
import { Ybarra } from './components/navbar2'
import { Index } from './components/Index';
import PrivateRoute from './components/PrivateRoute';
import {Profile} from './components/Profile';
import {Uploads} from './components/Uploads';
import {Error404} from './components/Error404';
import {Report} from './components/Report'
import {Audit} from './components/Audit'
import {ViewFiles} from './components/ViewFiles';
import {Checkusers} from './components/checkusers';
import { Recovery_Pass } from './components/Recovery_Pass';
import { ChangePass } from './components/ChangePass';
import {Cycles} from './components/Cycles';


function App() {
  const em = sessionStorage.getItem("email")
  return (
    <Router>
      {em && em !== "" && em !== undefined ? <Ybarra /> : <Xbarra />}
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Signup} />
          <Route exact path="/about" component={About} />
          <Route exact path="/Recovery_pass" component={Recovery_Pass} />
          <Route exact path="/ChangePass" component={ChangePass} />
          <PrivateRoute exact path="/checkusers" component={Checkusers} />
          <PrivateRoute exact path="/index" component={Index} />
          <PrivateRoute exact path="/upload" component={Uploads} />
          <PrivateRoute exact path="/report" component={Report} />
          <PrivateRoute exact path="/audit" component={Audit} />
          <PrivateRoute exact path="/viewfiles" component={ViewFiles} />
          <PrivateRoute exact path="/Cycles" component={Cycles} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <Route path="*" component={Error404} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
