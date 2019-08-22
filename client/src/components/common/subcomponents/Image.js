import React from "react";

const Image = ({ src }) => {
  return (
    <figure className="imageContainer image is-2by1">
      <img src={src} alt="Placeholder image" />
    </figure>
  );
};

export default Image;
