import React, { Fragment, useState, useEffect } from "react";

const Modal = ({
  children,
  trigger,
  modalToggleOverride,
  isModalActiveOverride,
  additionalClasses
}) => {
  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", toggleOnEscape, false);
    return () => {
      document.removeEventListener("keydown", toggleOnEscape, false);
    };
  }, [isModalActive, isModalActiveOverride]);

  const toggleOnEscape = e => {
    if (e.keyCode === 27) {
      if (
        isModalActiveOverride ||
        (isModalActiveOverride === undefined && isModalActive)
      ) {
        toggleModal();
      }
    }
  };

  const toggleModal = () => {
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
        <div
          class="modal-close is-large"
          aria-label="close"
          onClick={() => toggleModal()}
        ></div>
      </div>
    </Fragment>
  );
};

export default Modal;
