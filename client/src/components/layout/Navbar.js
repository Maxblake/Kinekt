import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
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

    document.body.classList.add("has-navbar-fixed-top");
    this.navMenu = React.createRef();
    this.navBurger = React.createRef();
  }

  componentDidMount() {
    //Navbar burger
    this.burger = document.querySelector(".burger");
    this.nav = document.querySelector("#" + this.burger.dataset.target);

    document.addEventListener("click", this.handleToggleNavMenu);

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

  componentWillUnmount() {
    document.removeEventListener("click", this.handleToggleNavMenu, false);
  }

  handleFormChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleToggleNavMenu = e => {
    const clickInsideMenu = this.navMenu.current.contains(e.target);
    const clickOnBurger = this.navBurger.current.contains(e.target);
    const navMenuActive = this.burger.classList.contains("is-active");
    const clickOnMenuButton =
      clickInsideMenu && e.target.classList.contains("button");

    if (navMenuActive) {
      if (!clickInsideMenu || clickOnMenuButton) {
        this.burger.classList.remove("is-active");
        this.nav.classList.remove("is-active");
      }
    } else if (clickOnBurger) {
      this.burger.classList.add("is-active");
      this.nav.classList.add("is-active");
    }
  };

  onSubmitGroupCode = e => {
    e.preventDefault();

    this.props.history.push(`/k/Chess_Club/group/${this.state.groupCode}`);
  };

  render() {
    const { isAuthenticated, loading } = this.props.auth;
    const { logout } = this.props;
    const { group } = this.props.group;

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
            <Link to="/account" className="button is-primary is-small">
              My Account &nbsp;
              <i className="fas fa-user-circle" />
            </Link>
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
          <span
            className="navbar-burger burger"
            data-target="navMenu"
            ref={this.navBurger}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </span>
        </div>
        <div id="navMenu" className="navbar-menu" ref={this.navMenu}>
          <div className="navbar-end">
            <div className="navbar-item">
              <form onSubmit={this.onSubmitGroupCode}>
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
                  <div className="control">
                    {this.state.groupCode !== "" ? (
                      <button
                        className="button is-primary is-small"
                        type="submit"
                      >
                        Join Group
                      </button>
                    ) : (
                      <button
                        className="button is-primary is-small"
                        type="submit"
                        disabled
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </form>
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
  group: state.group
});

export default connect(
  mapStateToProps,
  { logout }
)(withRouter(Navbar));
