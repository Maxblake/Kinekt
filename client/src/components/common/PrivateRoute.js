import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  location,
  ...rest
}) => {
  const shouldLoginFirst = !isAuthenticated && !loading;

  return (
    <Route
      {...rest}
      render={props =>
        shouldLoginFirst ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname }
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(PrivateRoute));
