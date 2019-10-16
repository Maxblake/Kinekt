import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { logout } from "../../actions/auth";
import { getGroup } from "../../actions/group";

import TypeWriter from "../../utils/typewriter";

import logo from "../../resources/logo_icon_md.png";

const Navbar = ({
  history,
  getGroup,
  logout,
  auth: { isAuthenticated, loading, user }
}) => {
  const [navData, setNavData] = useState({
    groupCode: ""
  });

  const { groupCode } = navData;
  let navBurger, navDropdown;

  useEffect(() => {
    document.body.classList.add("has-navbar-fixed-top");
    document.addEventListener("click", handleToggleNavDropdown);

    //Navbar burger
    navBurger = document.querySelector(".burger");
    navDropdown = document.querySelector("#" + navBurger.dataset.target);

    //Typewriter effect on logo
    const txtElement = document.querySelector("#logo-typewriter");
    const logo = document.querySelector("#logo-text");
    const words = [
      "with friends.",
      "with strangers.",
      "with peers.",
      "with locals.",
      "with colleagues.",
      "with humans."
    ];
    const wait = 1000;

    const typewriter = new TypeWriter(txtElement, words, wait);

    logo.addEventListener("mouseover", function() {
      typewriter.start();
    });
    logo.addEventListener("mouseout", function() {
      typewriter.stop();
    });
  }, []);

  const onChange = e =>
    setNavData({ ...navData, [e.target.name]: e.target.value });

  const handleToggleNavDropdown = e => {
    const clickInsideDropdown = navDropdown.contains(e.target);
    const clickOnBurger = navBurger.contains(e.target);
    const navDropdownActive = navBurger.classList.contains("is-active");
    const clickOnDropdownButton =
      clickInsideDropdown && e.target.classList.contains("button");

    if (navDropdownActive) {
      if (!clickInsideDropdown || clickOnDropdownButton) {
        navBurger.classList.remove("is-active");
        navDropdown.classList.remove("is-active");
      }
    } else if (clickOnBurger) {
      navBurger.classList.add("is-active");
      navDropdown.classList.add("is-active");
    }
  };

  const redirectToGroup = async (e, HRID) => {
    e.preventDefault();
    history.push(`/k/k/group/${HRID}`);
  };

  const authLinks = (
    <Fragment>
      {user && user.currentGroup && (
        <div className="navbar-item">
          <div className="buttons">
            <button
              onClick={e => redirectToGroup(e, user.currentGroup.HRID)}
              className="button is-primary is-outlined is-small"
              id="btn-current-group"
            >
              <span className="max-text-length-3">
                {user.currentGroup.name}
              </span>
              <span className="icon is-small">
                <i className="fas fa-chalkboard-teacher" />
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="navbar-item">
        <div className="buttons">
          <Link to="/account" className="button is-primary is-small">
            <span className="max-text-length-1">
              {user ? user.name : "My Account"}
            </span>{" "}
            &nbsp;
            <i className="fas fa-user-circle" />
          </Link>
          <button onClick={() => logout()} className="button is-dark is-small">
            Log out &nbsp;
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </div>
    </Fragment>
  );

  const guestLinks = (
    <div className="navbar-item">
      <div className="buttons">
        <Link to="/login" className="button is-dark is-small">
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
        <Link to="/" className="is-size-4">
          <div className="navbar-item">
            <img src={logo} alt="" />{" "}
            <span id="logo-text">HappenStack&nbsp;</span>
            <div id="logo-typewriter" className="is-size-4" />
          </div>
        </Link>
        <span className="navbar-burger burger" data-target="navMenu">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </span>
      </div>
      <div id="navMenu" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <form onSubmit={e => redirectToGroup(e, groupCode.toLowerCase())}>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="Enter group code"
                    name="groupCode"
                    value={groupCode}
                    onChange={e => onChange(e)}
                  />
                </div>
                <div className="control">
                  {groupCode !== "" ? (
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
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  getGroup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout, getGroup }
)(withRouter(Navbar));
