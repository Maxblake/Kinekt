import React, { Fragment, useState } from "react";

const Modal = ({
  children,
  trigger,
  modalToggleOverride,
  isModalActiveOverride,
  additionalClasses
}) => {
  const [isModalActive, setIsModalActive] = useState(false);

  const toggleModal = e => {
    if (isModalActiveOverride !== undefined) {
      modalToggleOverride();
    } else {
      setIsModalActive(!isModalActive);
    }
  };

  return (
    <Fragment>
      <div
        className="clickable-text is-inline-block"
        onClick={() => toggleModal()}
      >
        {trigger}
      </div>
      <div
        className={`modal ${
          isModalActiveOverride || isModalActive ? "is-active" : ""
        }`}
      >
        <div onClick={() => toggleModal()} className="modal-background" />
        <div
          className={`modal-content ${
            additionalClasses ? additionalClasses : ""
          }`}
        >
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
