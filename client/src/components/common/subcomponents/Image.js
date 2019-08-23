import React from "react";

const Image = ({ src, figureClasses, imageClasses }) => {
  return (
    <figure
      className={`imageContainer image ${figureClasses &&
        figureClasses.join(" ")}`}
    >
      <img
        className={`${imageClasses && imageClasses.join(" ")}`}
        src={src}
        alt="Placeholder image"
      />
    </figure>
  );
};

export default Image;
