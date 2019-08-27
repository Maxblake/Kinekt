import React, { useState } from "react";

import CustomField from "./CustomField";
import Image from "../common/subcomponents/Image";

const ImgUploadControl = ({ label, src, onChange, type }) => {
  const [imgData, setImgData] = useState({
    error: "",
    fileName: "",
    imgSrc: src
  });

  const { error, fileName, imgSrc } = imgData;
  const figureClass = "";
  const imageClass = "";

  const handleImageUpload = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) return;

    if (
      imageFile.size > e.target.attributes.getNamedItem("data-max-size").value
    ) {
      setImgData({ error: "Image file must be smaller than 10MB" });
      return;
    }

    setImgData({
      fileName: imageFile.name,
      imgSrc: URL.createObjectURL(imageFile)
    });
    onChange(imageFile);
  };

  switch (type) {
    case "profile":
      figureClass = "is-square";
      break;
    case "groupType":
    case "group":
      figureClass = "is-2by1";
      break;
  }

  return (
    <CustomField
      label={label}
      error={error}
      children={
        <div className="field">
          <div className="file has-name is-primary">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                data-max-size="10485760"
                onChange={e => handleImageUpload(e)}
              />
              <span className="file-cta">
                <span className="icon">
                  <i className="fas fa-upload" />
                </span>
              </span>
              <span className="file-name">
                {fileName ? fileName : "No image selected.."}
              </span>
            </label>
          </div>
          {imgSrc && (
            <div className="image-preview">
              <Image
                src={imgSrc}
                figureClass={figureClass}
                imageClass={imageClass}
              />
            </div>
          )}
        </div>
      }
    />
  );
};

export default ImgUploadControl;
