import React from "react";

import lostMoto from "../../resources/lost_moto.png";

export default function NotFound() {
  return (
    <div className="flex-row-wrap page-not-found">
      <div className="page-not-found-warning">
        <h1 className="is-size-1 is-size-2-touch">404</h1>
        <div className="hs-box is-size-4 is-size-5-touch">
          <strong>Blam!</strong> You've reached a page that shouldn't exist,
          sorry about that.
        </div>
      </div>
      <div id="lost-moto">
        <img src={lostMoto} alt="" />
      </div>
    </div>
  );
}
