import React, { Component } from "react";

import TypeWriter from "../../js/typewriter";

class Navbar extends Component {
  state = {
    typewriter: null
  };

  componentDidMount() {
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
      "with your friends.",
      "with complete strangers.",
      "with your peers.",
      "with the locals.",
      "with your colleagues.",
      "with other humans."
    ];
    const wait = 1000;
    const self = this;

    this.setState({ typewriter: new TypeWriter(txtElement, words, wait) });

    logo.addEventListener("mouseover", function() {
      self.state.typewriter.start();
    });
    logo.addEventListener("mouseout", function() {
      self.state.typewriter.stop();
    });
  }

  render() {
    return (
      <nav className="navbar is-black is-fixed-top">
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item">
              <a
                id="logo"
                className="is-size-4"
                href="#"
                onMouseEnter={this.handleLogoHover}
                onMouseLeave={this.handleLogoHover}
              >
                Kinekt&nbsp;
              </a>
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
                <div className="buttons">
                  <a className="button is-black">Log in</a>
                  <a className="button is-light">Sign up</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
