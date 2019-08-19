import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Alert from "./components/layout/Alert";
import Login from "./components/auth/Login";
import Register from "./components/user/Register";
import EditUser from "./components/user/EditUser";
import NotFound from "./components/common/NotFound";
import Home from "./components/home/Home";
import NewGroupType from "./components/group-type/NewGroupType";
import GroupType from "./components/group-type/GroupType";
import NewGroup from "./components/group-type/new-group/NewGroup";
import Group from "./components/group/Group";
import Admin from "./components/auth/Admin";

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
      <Router>
        <div className="App">
          <Navbar />
          <div className="container siteContent">
            <Alert />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/not-found" component={NotFound} />
              <Route exact path="/k/:groupType" component={GroupType} />
              <PrivateRoute exact path="/account" component={EditUser} />
              <PrivateRoute
                exact
                path="/k/:groupType/create"
                component={NewGroup}
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
