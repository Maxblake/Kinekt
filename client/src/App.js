import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import PrivateRoute from "./components/common/PrivateRoute";
import SocketHandler from "./components/auth/SocketHandler";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Alert from "./components/alerts/Alert";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import Register from "./components/user/Register";
import EditUser from "./components/user/EditUser";
import GroupLocks from "./components/user/GroupLocks";
import NotFound from "./components/common/NotFound";
import Home from "./components/home/Home";
import NewGroupType from "./components/group-type/NewGroupType";
import GroupType from "./components/group-type/GroupType";
import EditGroupType from "./components/group-type/EditGroupType";
import NewGroup from "./components/group/NewGroup";
import EditGroup from "./components/group/EditGroup";
import Group from "./components/group/Group";
import Admin from "./components/auth/Admin";
import FAQ from "./components/static-pages/FAQ/FAQ";

//import BetaEntry from "./components/auth/BetaEntry";

import "./styling/App.scss";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <SocketHandler />
      <Router>
        <div className="App">
          <div className="background">
            {true && <div className="background-image"></div>}
          </div>
          <Navbar />
          <div className="container site-content">
            <Alert />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/login/:verificationToken" component={Login} />
              <Route exact path="/reset-password" component={ResetPassword} />
              <Route
                exact
                path="/reset-password/:resetToken"
                component={ResetPassword}
              />
              <Route exact path="/not-found" component={NotFound} />
              <Route exact path="/FAQ" component={FAQ} />
              <Route exact path="/k/:groupType" component={GroupType} />
              <PrivateRoute exact path="/account" component={EditUser} />
              <PrivateRoute exact path="/grouplocks" component={GroupLocks} />
              <PrivateRoute
                exact
                path="/k/:groupType/create"
                component={NewGroup}
              />
              <PrivateRoute
                exact
                path="/k/:groupType/group/:groupCode/edit"
                component={EditGroup}
              />
              <PrivateRoute
                exact
                path="/k/:groupType/group/:groupCode"
                component={Group}
              />
              <PrivateRoute
                exact
                path="/request-grouptype"
                component={NewGroupType}
              />
              <PrivateRoute
                exact
                path="/k/:groupType/edit"
                component={EditGroupType}
              />
              <PrivateRoute exact path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
