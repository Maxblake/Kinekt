import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Discover from "./Discover";
import DiscoverHeader from "./DiscoverHeader";
import Spinner from "../common/Spinner";

const Home = ({ auth }) => {
  const { isAuthenticated, loading, token } = auth;

  if (loading) {
    return <Spinner isMidpage />;
  }

  if (!isAuthenticated && !!token) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {!loading && !isAuthenticated ? <DiscoverHeader /> : <Discover />}
    </div>
  );
};

Home.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Home);
