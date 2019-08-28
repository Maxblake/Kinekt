import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { logout } from "../../actions/auth";
import { getGroup } from "../../actions/group";

import TypeWriter from "../../js/typewriter";

const Navbar = ({
  history,
  getGroup,
  logout,
  auth: { isAuthenticated, loading },
  group,
  groupType
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

  const onSubmitGroupCode = async e => {
    e.preventDefault();

    getGroup(groupCode, history);
  };

  const authLinks = (
    <Fragment>
      {group && groupType && (
        <div className="navbar-item">
          <div className="buttons">
            <Link
              to={`/k/${groupType.name.split(" ").join("_")}/group/${
                group.HRID
              }`}
              className="button is-primary is-outlined is-small"
              id="btn-current-group"
            >
              <span>{group.name}</span>
              <span className="icon is-small">
                <i className="fas fa-chalkboard-teacher" />
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
          <a
            onClick={() => logout()}
            href="#!"
            className="button is-dark-theme is-small"
          >
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
        <Link to="/login" className="button is-dark-theme is-small">
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
          <Link to="/" id="logo" className="is-size-4">
            Kinekt&nbsp;
          </Link>
          <div id="logo-typewriter" className="is-size-4" />
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
            <form onSubmit={e => onSubmitGroupCode(e)}>
              <div className="field has-addons">
                <div className="control">
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
  auth: PropTypes.object.isRequired,
  group: PropTypes.object,
  groupTypeName: PropTypes.string
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group.group,
  groupType: state.groupType.groupType
});

export default connect(
  mapStateToProps,
  { logout, getGroup }
)(withRouter(Navbar));
