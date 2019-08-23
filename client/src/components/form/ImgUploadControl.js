import React from "react";

import CustomField from "./CustomField";

const ImgUploadControl = ({ label, name, image, onChange }) => {
  return (
    <CustomField
      label={label}
      error={image.error}
      children={
        <div class="field">
          <div class="file has-name is-primary">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name={name}
                accept="image/*"
                data-max-size="10485760"
                onChange={e => onChange(e)}
              />
              <span class="file-cta">
                <span class="icon">
                  <i class="fas fa-upload" />
                </span>
              </span>
              <span class="file-name">
                {image.name ? image.name : "No image selected.."}
              </span>
            </label>
          </div>
        </div>
      }
    />
  );
};

export default ImgUploadControl;
