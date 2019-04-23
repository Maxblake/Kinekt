import React, { Component } from "react";

import Navbar from "./components/layout/Navbar";

import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="App has-navbar-fixed-top">
        <Navbar />
        hey bitches
      </div>
    );
  }
}

export default App;
