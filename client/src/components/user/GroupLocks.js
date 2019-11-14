import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { isReferralCodeValid, buyLocks } from "../../actions/user";
import { copyToClipboard } from "../../utils/utils";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import RadioButton from "../form/RadioButton";
import Modal from "../common/subcomponents/Modal";
import Tooltip from "../common/Tooltip";
import StripeCheckout from "react-stripe-checkout";

import logo from "../../resources/logo_icon_black.png";

const GroupLocks = ({
  isReferralCodeValid,
  buyLocks,
  errors,
  auth: { user, loading }
}) => {
  const [formData, setFormData] = useState({
    groupLocks: 0,
    pricingDetails: {},
    referralCode: "",
    showCopyRefTooltip: false
  });

  const {
    groupLocks,
    pricingDetails,
    referralCode,
    showCopyRefTooltip
  } = formData;

  const errRefCode = errors.find(error => error.param === "referralCode");
  const checkRefCodeTimeout = React.useRef(null);

  const handleGroupLocksChange = groupLocks => {
    setFormData({
      ...formData,
      groupLocks,
      pricingDetails: getPricingDetails(groupLocks)
    });
  };

  const onSubmit = e => {
    e.preventDefault();
  };

  const onChange = e => {
    const newVal = e.target.value;

    setFormData({ ...formData, [e.target.name]: newVal });
    if (e.target.name === "referralCode") {
      clearTimeout(checkRefCodeTimeout.current);
      checkRefCodeTimeout.current = setTimeout(
        () => isReferralCodeValid(newVal),
        200
      );
    }
  };

  const getPricingDetails = groupLocks => {
    const rateMap = {
      3: 90,
      8: 81,
      21: 72,
      55: 63
    };

    const basePrice = (groupLocks * 90) / 100;
    const discountedPrice = (groupLocks * rateMap[groupLocks]) / 100;
    const discount = basePrice - discountedPrice;

    return {
      basePrice,
      basePriceUSD: basePrice.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      }),
      discountedPrice,
      discountedPriceUSD: discountedPrice.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      }),
      discount,
      discountUSD: discount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })
    };
  };

  const copyRefToClipboard = e => {
    copyToClipboard("1234567");
    setFormData({ ...formData, showCopyRefTooltip: true });
  };

  const onToken = token => {
    const charge = {
      amount: pricingDetails.discountedPrice * 100,
      currency: "usd",
      description: `${groupLocks} group locks - HappenStack`,
      source: token.id
    };

    const opts = {
      groupLocks,
      referralCode
    };

    buyLocks(charge, opts);
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  const submitBtnTxt =
    groupLocks > 0 ? (
      <Fragment>
        <span className="is-hidden-touch">{`Buy ${groupLocks} group locks for ${pricingDetails.discountedPriceUSD}`}</span>
        <span className="is-hidden-desktop">
          {`Buy ${groupLocks} `}
          &nbsp;
          <span className="icon is-small">
            <i className="fas fa-sm fa-lock" />
          </span>
          &nbsp;
          {` (${pricingDetails.discountedPriceUSD})`}
        </span>
      </Fragment>
    ) : (
      "No quantity selected"
    );

  return (
    <section className="centered-form grouplocks-section">
      <nav className="level" id="page-nav">
        <PageTitle title="Manage Group Locks" />
      </nav>

      <Form onSubmit={onSubmit}>
        <CustomField
          label="Select Quantity"
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
                      <span className="tag has-text-weight-bold has-text-success">
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
                      <span className="tag has-text-weight-bold has-text-success">
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
                      <span className="tag has-text-weight-bold has-text-success">
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

        {pricingDetails.basePriceUSD && (
          <div className="checkout-container">
            <ul>
              <li>
                <span className="has-text-weight-bold">Base price: </span>
                <span>{pricingDetails.basePriceUSD}</span>
              </li>
              <li>
                <span className="has-text-weight-bold">Discount: </span>
                <span className="has-text-weight-bold has-text-success">
                  -{pricingDetails.discountUSD}
                </span>
              </li>
              <li>
                <span className="has-text-weight-bold">Total price: </span>
                <span className="has-text-weight-bold">
                  {pricingDetails.discountedPriceUSD}
                </span>
              </li>
            </ul>
          </div>
        )}

        <CustomField
          label={
            <span>
              Referral Code&nbsp;
              <Modal
                trigger={
                  <span className="icon info-icon">
                    <i className="far fa-question-circle" />
                  </span>
                }
              >
                <div className="hs-box info-modal is-vcentered">
                  <div className="icon is-large info-icon">
                    <i className="far fa-3x fa-question-circle" />
                  </div>
                  <div className="content">
                    Enter a friend's referral code here and both of you will
                    receive extra group locks after checkout. The number of
                    locks recieved ranges from 1-5 depending on the amount
                    purchased.
                    <br />
                    <br />
                    Your personal referral code is:
                    <br />
                    {document.queryCommandSupported("copy") && (
                      <div
                        className="is-fullwidth has-text-centered is-relative clickable-text has-text-link"
                        onClick={e => copyRefToClipboard(e)}
                      >
                        <Tooltip
                          body="Referral code copied to clipboard"
                          isVisible={showCopyRefTooltip}
                          setIsVisible={isVisible =>
                            setFormData({
                              ...formData,
                              showCopyRefTooltip: isVisible
                            })
                          }
                        />
                        <span className="ws-nowrap">
                          <span>{user.referralCode}</span>
                          <span className="icon">
                            <i className="fas fa-link"></i>
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>
            </span>
          }
          children={
            <Fragment>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input is-smallish is-fullwidth"
                    name="referralCode"
                    value={referralCode}
                    onChange={e => onChange(e)}
                    placeholder="Enter referral code"
                  />
                </div>

                <StripeCheckout
                  stripeKey="pk_test_GigRsjhZ4K4ocwecpPvMDQ5Y000ozEPzR3"
                  token={onToken}
                  name="HappenStack" // the pop-in header title
                  description="Groups on the fly" // the pop-in header subtitle
                  image={logo}
                  ComponentClass={({ children, ...props }) => (
                    <div className="control" {...props}>
                      {children}
                    </div>
                  )}
                  amount={pricingDetails.discountedPrice * 100} // cents
                  currency="USD"
                  locale="auto"
                >
                  <SubmitButton
                    buttonClasses={["is-smallish"]}
                    isAddon
                    isDisabled={!!errRefCode || groupLocks === 0}
                    text={submitBtnTxt}
                  />
                </StripeCheckout>
              </div>
              {errRefCode && <p className="help is-danger">{errRefCode.msg}</p>}
            </Fragment>
          }
        />
      </Form>
    </section>
  );
};

GroupLocks.propTypes = {
  isReferralCodeValid: PropTypes.func.isRequired,
  buyLocks: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(mapStateToProps, { isReferralCodeValid, buyLocks })(
  GroupLocks
);
