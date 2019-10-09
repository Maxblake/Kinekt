import React from "react";
import { Link } from "react-router-dom";

import Modal from "../common/subcomponents/Modal";

import logo from "../../resources/logo_horizontal_md.png";

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="columns">
        <div className="column">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Modal trigger="Terms of Service">
                  <div className="hs-box info-modal is-vcentered has-rounded-corners">
                    <div className="icon is-large info-icon">
                      <i className="far fa-3x fa-question-circle" />
                    </div>
                    <div className="content">
                      Hey there. If you're reading this, thanks for doing your
                      part and checking out the terms of service. HappenStack is
                      unreleased at this time, so there's nothing official to
                      see here. For now, just please don't do anything stupid
                      with this software, and if you get caught doing something
                      stupid with this software, don't sue me.
                      <br />
                      <br />
                      I'd like this modal to look like an actual TOS in the
                      meantime, so here's a snippet from the Cars 2 script.
                      <br />
                      <br />
                      A sleek British sports car talks directly to us in a
                      pixilated, garbled video. He's OUT OF BREATH. Crates are
                      visible behind him. We're in the shadowy bowels of a steel
                      room.
                      <br />
                      <br />
                      LELAND TURBO This is Agent Leland Turbo. I have a flash
                      transmission for Agent Finn McMissile.
                      <br />
                      <br />
                      SUPERIMPOSE OVER BLACK: WALT DISNEY PICTURES PRESENTS
                      <br />
                      <br />
                      LELAND TURBO Finn. My cover's been compromised.
                      Everything's gone pear-shaped.
                      <br />
                      <br />
                      SUPERIMPOSE OVER BLACK: A PIXAR ANIMATION STUDIOS FILM
                      <br />
                      <br />
                      LELAND TURBO You won't believe what I've found out here.
                      <br />
                      <br />
                      He angles our camera view, reveals a PORTHOLE through
                      which we can see flames rising in the distance.
                      <br />
                      <br />
                    </div>
                  </div>
                </Modal>
              </li>
              <li>
                <Link to="/FAQ">FAQ</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="column">
          <div className="centered-logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="column">
          <div className="content has-text-centered">
            <p>Copyright &copy; {new Date().getFullYear()} HappenStack</p>
          </div>
        </div>
      </nav>
    </footer>
  );
}
