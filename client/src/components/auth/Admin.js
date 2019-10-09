import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  getRequestedGroupTypes,
  processRequestedGroupTypes,
  deleteGroupType
} from "../../actions/admin";
import { loadUser } from "../../actions/auth";
import { getGroupTypes } from "../../actions/groupType";

import NotFound from "../common/NotFound";
import RadioButton from "../form/RadioButton";

const Admin = ({
  loadUser,
  getRequestedGroupTypes,
  processRequestedGroupTypes,
  deleteGroupType,
  getGroupTypes,
  groupType: { groupTypes }
}) => {
  const [adminState, setAdminState] = useState({
    isAdmin: false,
    requestedGroupTypes: [],
    groupTypeDecisions: {},
    adminOptions: "Requested Group Types"
  });

  const {
    requestedGroupTypes,
    isAdmin,
    groupTypeDecisions,
    adminOptions
  } = adminState;

  useEffect(() => {
    if (!isAdmin) {
      let fetchData = async () => {
        const loadUserResponse = await loadUser(true);
        await getGroupTypes({ category: "All" });

        setAdminState({ ...adminState, isAdmin: loadUserResponse });
      };

      fetchData();
    } else if (requestedGroupTypes.length < 1) {
      let fetchData = async () => {
        const getRequestedGroupTypesResponse = await getRequestedGroupTypes();

        setAdminState({
          ...adminState,
          requestedGroupTypes: getRequestedGroupTypesResponse
        });
      };

      fetchData();
    } else {
      const groupTypeDecisionsBuilder = {};

      requestedGroupTypes.forEach(requestedGroupType => {
        groupTypeDecisionsBuilder[requestedGroupType._id] = "";
      });

      setAdminState({
        ...adminState,
        groupTypeDecisions: groupTypeDecisionsBuilder
      });
    }
  }, [isAdmin, requestedGroupTypes]);

  const onChange = e => {
    setAdminState({
      ...adminState,
      [e.target.name]: e.target.value
    });
  };

  const handleGroupTypeDecided = (decision, key) => {
    setAdminState({
      ...adminState,
      groupTypeDecisions: { ...groupTypeDecisions, [key]: decision }
    });
  };

  const onSubmitGroupTypes = () => {
    if (window.confirm("You sure, dude?")) {
      const requestDecisions = {};

      for (const key of Object.keys(groupTypeDecisions)) {
        if (groupTypeDecisions[key] !== "") {
          requestDecisions[key] = groupTypeDecisions[key];
        }
      }

      processRequestedGroupTypes(requestDecisions);

      //TODO make sure this works
      setAdminState({
        ...adminState,
        requestedGroupTypes: requestedGroupTypes.filter(
          requestedGroupType =>
            groupTypeDecisions[requestedGroupType._id] === ""
        )
      });
    }
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  let portalView = null;

  switch (adminOptions) {
    case "Requested Group Types":
      portalView =
        requestedGroupTypes.length > 0 ? (
          <Fragment>
            <h2 className="is-size-4">Requested Group Types</h2>
            <table className="requestedGroupTypeList">
              <tbody>
                {requestedGroupTypes.map(requestedGroupType => (
                  <tr key={requestedGroupType._id}>
                    <td className="imageCell">
                      <img
                        src={
                          requestedGroupType.image
                            ? requestedGroupType.image.link
                            : ""
                        }
                        alt="Nothing here"
                      />
                    </td>
                    <td className="col-stretch">
                      <h5 className="is-size-5">{requestedGroupType.name}</h5>
                      <h6 className="is-size-6">
                        {requestedGroupType.description}
                      </h6>
                    </td>
                    <td>{requestedGroupType.category}</td>
                    <td>
                      <div className="field is-grouped">
                        <div className="control">
                          <RadioButton
                            selectedValue={
                              groupTypeDecisions[requestedGroupType._id]
                            }
                            valueKey={requestedGroupType._id}
                            value="Accept"
                            handleClick={handleGroupTypeDecided}
                          />
                        </div>
                        <div className="control">
                          <RadioButton
                            selectedValue={
                              groupTypeDecisions[requestedGroupType._id]
                            }
                            valueKey={requestedGroupType._id}
                            value="Reject"
                            handleClick={handleGroupTypeDecided}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="content has-text-centered">
              <h3>- This is the end. -</h3>
            </div>

            <div
              className="control has-text-centered btn-admin-submit"
              onClick={() => onSubmitGroupTypes()}
            >
              <button className="button is-primary" type="button">
                Submit
              </button>
            </div>
          </Fragment>
        ) : (
          <h2 className="is-size-4">No new Requested Group Types</h2>
        );
      break;
    case "Current Group Types":
      portalView =
        groupTypes.length > 0 ? (
          <Fragment>
            <h2 className="is-size-4">Current Group Types</h2>
            <table className="requestedGroupTypeList">
              <tbody>
                {groupTypes.map(groupType => (
                  <tr key={groupType._id}>
                    <td className="imageCell">
                      <img
                        src={groupType.image ? groupType.image.link : ""}
                        alt="Nothing here"
                      />
                    </td>
                    <td className="col-stretch">
                      <h5 className="is-size-5">{groupType.name}</h5>
                      <h6 className="is-size-6">{groupType.description}</h6>
                    </td>
                    <td>{groupType.category}</td>
                    <td>
                      <div className="field is-grouped">
                        <div className="control">
                          <button
                            className="button"
                            onClick={() => deleteGroupType(groupType._id)}
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="content has-text-centered">
              <h3>- This is the end. -</h3>
            </div>
          </Fragment>
        ) : (
          <h2 className="is-size-4">No Group Types in state</h2>
        );
      break;
    default: {
    }
  }

  return (
    <section className="adminPage">
      <nav className="level" id="page-nav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 page-title">Admin Portal</h3>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <div className="field">
              <div className="select">
                <select
                  name="adminOptions"
                  value={adminOptions}
                  onChange={e => onChange(e)}
                >
                  <option>Requested Group Types</option>
                  <option>Current Group Types</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="admin-portal">{portalView}</div>
    </section>
  );
};

Admin.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getRequestedGroupTypes: PropTypes.func.isRequired,
  processRequestedGroupTypes: PropTypes.func.isRequired,
  deleteGroupType: PropTypes.func.isRequired,
  getGroupTypes: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  {
    getRequestedGroupTypes,
    processRequestedGroupTypes,
    deleteGroupType,
    getGroupTypes,
    loadUser
  }
)(Admin);
