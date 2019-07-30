import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

import TypeWriter from "../../js/typewriter";
import group from "../../reducers/group";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typewriter: null,
      groupCode: ""
    };
  }

  componentDidMount() {
    document.body.classList.add("has-navbar-fixed-top");

    //Navbar burger
    const burger = document.querySelector(".burger");
    const nav = document.querySelector("#" + burger.dataset.target);

    burger.addEventListener("click", function() {
      burger.classList.toggle("is-active");
      nav.classList.toggle("is-active");
    });

    //Typewriter effect on logo
    const txtElement = document.querySelector("#logo_typewriter");
    const logo = document.querySelector("#logo");
    const words = [
      "with friends.",
      "with strangers.",
      "with peers.",
      "with locals.",
      "with colleagues.",
      "with humans."
    ];
    const wait = 1000;

    this.setState({ typewriter: new TypeWriter(txtElement, words, wait) });

    // Reference to 'this' that obeys lexical scope in callbacks
    var self = this;

    logo.addEventListener("mouseover", function() {
      self.state.typewriter.start();
    });
    logo.addEventListener("mouseout", function() {
      self.state.typewriter.stop();
    });
  }

  handleFormChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { isAuthenticated, loading } = this.props.auth;
    const { logout, group } = this.props;

    const authLinks = (
      <Fragment>
        {group && (
          <div className="navbar-item">
            <div className="buttons">
              <Link
                to={`/k/Chess_Club/group/${group.HRID}`}
                className="button is-primary is-outlined is-small"
                id="currentGroupBtn"
              >
                <span>{group.name}</span>
                <span class="icon is-small">
                  <i class="fas fa-chalkboard-teacher" />
                </span>
              </Link>
            </div>
          </div>
        )}
        <div className="navbar-item">
          <div className="buttons">
            <a onClick={logout} href="#!" className="button is-black is-small">
              Log out &nbsp;
              <i className="fas fa-sign-out-alt" />
            </a>
          </div>
        </div>
      </Fragment>
    );
    const guestLinks = (
      <div className="navbar-item">
        <div className="buttons">
          <Link to="/login" className="button is-black is-small">
            Log in
          </Link>
          <Link to="/register" className="button is-primary is-small">
            Sign up
          </Link>
        </div>
      </div>
    );

    // TODO handle group type in link path
    const groupCodeLink =
      this.state.groupCode !== "" ? (
        <Link
          className="button is-primary is-small"
          to={`/k/Chess_Club/group/${this.state.groupCode}`}
        >
          Join Group
        </Link>
      ) : (
        <button className="button is-primary is-small" disabled>
          Join Group
        </button>
      );

    return (
      <nav className="navbar is-black is-fixed-top">
        <div className="navbar-brand">
          <div className="navbar-item">
            <Link
              to="/"
              id="logo"
              className="is-size-4"
              onMouseEnter={this.handleLogoHover}
              onMouseLeave={this.handleLogoHover}
            >
              Kinekt&nbsp;
            </Link>
            <div id="logo_typewriter" className="is-size-4" />
          </div>
          <span className="navbar-burger burger" data-target="navMenu">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </span>
        </div>
        <div id="navMenu" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="field has-addons">
                <div className="control">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="Enter group code"
                    name="groupCode"
                    value={this.state.groupCode}
                    onChange={this.handleFormChange}
                  />
                </div>
                <div className="control">{groupCodeLink}</div>
              </div>
            </div>

            {!loading && (
              <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group.group
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
