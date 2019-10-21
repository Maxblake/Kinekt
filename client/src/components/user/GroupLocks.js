import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { buyLocks } from "../../actions/user";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import RadioButton from "../form/RadioButton";
import Modal from "../common/subcomponents/Modal";

const GroupLocks = ({ buyLocks, errors, auth: { user, loading } }) => {
  const [formData, setFormData] = useState({
    groupLocks: 0
  });

  const { groupLocks } = formData;

  //const errName = errors.find(error => error.param === "name");

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        groupLocks: user.groupLocks
      });
    }
  }, [user]);

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGroupLocksChange = groupLocks => {
    setFormData({ ...formData, groupLocks });
  };

  const onSubmit = e => {
    e.preventDefault();

    buyLocks(groupLocks);
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  /*             <option>3 group locks ($2.40 USD)</option>
            <option>8 group locks ($5.76 USD) 10% off</option>
            <option>21 group locks ($13.44 USD) 20% off</option>
            <option>55 group locks ($30.80 USD) 30% off</option> */

  return (
    <section className="centered-form">
      <nav className="level" id="page-nav">
        <PageTitle title="Manage Group Locks" />
      </nav>

      <Form onSubmit={onSubmit}>
        <CustomField
          label="Buy More"
          children={
            <div className="field is-grouped is-grouped-multiline">
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={groupLocks}
                  value="3"
                  customLabel={
                    <Fragment>
                      <span>3</span>
                      <span className="icon is-small">
                        <i className="fas fa-sm fa-lock" />
                      </span>
                    </Fragment>
                  }
                  handleClick={handleGroupLocksChange}
                />
              </div>
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={groupLocks}
                  value="8"
                  customLabel={
                    <Fragment>
                      <span>8</span>
                      <span className="icon is-small">
                        <i className="fas fa-sm fa-lock" />
                      </span>
                      <span className="tag has-text-weight-bold has-text-success button-tag-right">
                        10% off
                      </span>
                    </Fragment>
                  }
                  handleClick={handleGroupLocksChange}
                />
              </div>
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={groupLocks}
                  value="21"
                  customLabel={
                    <Fragment>
                      <span>21</span>
                      <span className="icon is-small">
                        <i className="fas fa-sm fa-lock" />
                      </span>
                      <span className="tag has-text-weight-bold has-text-success button-tag-right">
                        20% off
                      </span>
                    </Fragment>
                  }
                  handleClick={handleGroupLocksChange}
                />
              </div>
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={groupLocks}
                  value="55"
                  customLabel={
                    <Fragment>
                      <span>55</span>
                      <span className="icon is-small">
                        <i className="fas fa-sm fa-lock" />
                      </span>
                      <span className="tag has-text-weight-bold has-text-success button-tag-right">
                        30% off
                      </span>
                    </Fragment>
                  }
                  handleClick={handleGroupLocksChange}
                />
              </div>
            </div>
          }
        />

        <SubmitButton text="Save Changes" />
      </Form>
    </section>
  );
};

GroupLocks.propTypes = {
  buyLocks: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { buyLocks }
)(GroupLocks);
