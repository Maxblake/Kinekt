import React, { useState, Fragment } from "react";
import { connect } from "react-redux";

import { enterBeta } from "../../actions/auth";

import Form from "../form/Form";
import FormControl from "../form/FormControl";

const BetaEntry = ({ enterBeta }) => {
  const [formData, setFormData] = useState({
    entryToken: ""
  });

  const { entryToken } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    enterBeta(entryToken);

    setFormData({ entryToken: "" });
  };

  return (
    <div className="beta-entry-container has-text-centered">
      <Form onSubmit={onSubmit}>
        <FormControl
          customLabel={
            <Fragment>
              <span className="icon is-small">
                <i className="fas fa-skull-crossbones" aria-hidden="true" />
              </span>
              <br />
              <span>Ahoy!</span>
              <span>
                If ye wish to board this ship, ye must know the answer to this
                riddle. <br /> What organization can pirates become a part of
                when they turn 50?
              </span>
            </Fragment>
          }
          placeholder="Entry Token"
          name="entryToken"
          type="password"
          value={entryToken}
          onChange={onChange}
        />
      </Form>
    </div>
  );
};

export default connect(
  null,
  { enterBeta }
)(BetaEntry);
