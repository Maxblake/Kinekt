import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Alert from "./components/layout/Alert";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import EditUser from "./components/user/EditUser";
import NotFound from "./components/common/NotFound";
import Home from "./components/home/Home";
import GroupType from "./components/group-type/GroupType";
import NewGroup from "./components/group-type/new-group/NewGroup";
import Group from "./components/group/Group";

import "./styling/App.scss";

// Check for token
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // clear current profile
    //store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

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
              {/* TODO create 404 page */}
              {/* <Route component={NoMatch} /> */}
            </Switch>
          </div>

          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
