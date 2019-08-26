import React from "react";

const Image = ({ src, figureClass = "", imageClass = "" }) => {
  return (
    <figure className={`imageContainer image ${figureClass}`}>
      <img className={`${imageClass}`} src={src} alt="Placeholder image" />
    </figure>
  );
};

export default Image;
