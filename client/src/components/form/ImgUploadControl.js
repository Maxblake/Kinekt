import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useDropzone } from "react-dropzone";

import CustomField from "./CustomField";
import Image from "../common/subcomponents/Image";

const ImgUploadControl = ({ label, src, onChange, type }) => {
  const [imgData, setImgData] = useState({
    error: "",
    fileName: !!src && src.length > 0 ? "Previewing current image" : "",
    imgSrc: src
  });

  const { error, fileName, imgSrc } = imgData;
  const maxSize = 1048576 * 2;
  let figureClass = "";
  let imageClass = "";

  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(imgSrc);
    };
  }, [imgSrc]);

  const onDrop = useCallback(
    acceptedFiles => {
      const imageFile = acceptedFiles[0];

      if (!imageFile) return;

      if (imageFile.size > maxSize) {
        setImgData({ error: "Image file must be smaller than 2MB" });
        return;
      }

      setImgData({
        fileName: imageFile.name,
        imgSrc: URL.createObjectURL(imageFile)
      });
      onChange(imageFile);
    },
    [onChange]
  );

  const onClickRemove = () => {
    setImgData({
      fileName: "",
      imgSrc: ""
    });
    onChange("REMOVE");
  };

  const {
    isDragActive,
    getRootProps,
    getInputProps,
    rejectedFiles
  } = useDropzone({
    onDrop,
    maxSize,
    accept: "image/jpeg, image/png"
  });

  const isFileTooLarge =
    rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

  switch (type) {
    case "profile":
      figureClass = "is-square";
      break;
    case "groupType":
    case "group":
      figureClass = "is-2by1";
      break;
    default:
      break;
  }

  //onChange={e => handleImageUpload(e)}

  return (
    <CustomField
      label={label}
      children={
        <Fragment>
          <div className="field has-addons">
            <div className="file has-name is-primary is-fullwidth">
              <div className="file-label" {...getRootProps()}>
                <input
                  className="file-input"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  {...getInputProps()}
                />
                <span className="file-cta">
                  <span className="icon">
                    <i className="fas fa-upload" />
                  </span>
                </span>
                <span className="file-name">
                  {isFileTooLarge
                    ? "That one's too big for this ship!"
                    : isDragActive
                    ? "Drop 'er here, captain!"
                    : rejectedFiles.length > 0
                    ? "Wrong type of fish, throw 'er back!"
                    : fileName
                    ? fileName
                    : "No image selected.."}
                </span>
              </div>
            </div>
            {!!imgSrc && (
              <div className="control">
                <button
                  type="button"
                  onClick={() => onClickRemove()}
                  className="button is-danger"
                >
                  <span>
                    <i className="fas fa-minus is-hidden-desktop"></i>
                    <span className="is-hidden-touch">Remove</span>
                  </span>
                </button>
              </div>
            )}
            {error && <p className="help is-danger">{error}</p>}
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
        </Fragment>
      }
    />
  );
};

export default ImgUploadControl;
