import React from "react";
import lostMoto from "../../resources/lostMoto.png";

export default function NotFound() {
  return (
    <div className="flex-row-wrap pageNotFound">
      <div className="pageNotFoundWarning">
        <h1 className="is-size-1 is-size-2-touch">404</h1>
        <div className="box is-size-4 is-size-5-touch">
          <strong>Blam!</strong> You've reached a page that shouldn't exist,
          sorry about that.
        </div>
      </div>
      <div id="lostMoto">
        <img src={lostMoto} alt="" />
      </div>
    </div>
  );
}
