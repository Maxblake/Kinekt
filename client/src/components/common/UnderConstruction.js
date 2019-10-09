import React from "react";

import coffeeCup from "../../resources/coffee_cup.png";

export default function UnderConstruction() {
  return (
    <div className="flex-row-wrap page-not-found">
      <div className="page-not-found-warning">
        <h1 className="is-size-1 is-size-2-touch">
          <strong>Woah There!</strong>
        </h1>
        <div className="hs-box is-size-4 is-size-5-touch">
          Looks like you're too fast for us- this page isn't dressed just yet.
          Please try again another time.
        </div>
      </div>
      <div id="lost-moto">
        <img src={coffeeCup} alt="" />
      </div>
    </div>
  );
}
