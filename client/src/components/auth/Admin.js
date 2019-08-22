import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  getRequestedGroupTypes,
  processRequestedGroupTypes
} from "../../actions/admin";
import { loadUser } from "../../actions/auth";

import NotFound from "../common/NotFound";
import RadioButton from "../form/RadioButton";

const Admin = ({
  loadUser,
  getRequestedGroupTypes,
  processRequestedGroupTypes
}) => {
  const [adminState, setAdminState] = useState({
    isAdmin: false,
    requestedGroupTypes: [],
    groupTypeDecisions: {}
  });

  const { requestedGroupTypes, isAdmin, groupTypeDecisions } = adminState;

  useEffect(() => {
    if (!isAdmin) {
      let fetchData = async () => {
        const loadUserResponse = await loadUser(true);

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

  return (
    <section className="adminPage">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">Admin Portal</h3>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <div className="field">
              <div className="select">
                <select>
                  <option>Requested Group Types</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="adminPortal">
        {requestedGroupTypes.length > 0 ? (
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
                        alt="No image"
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
                      <div class="field is-grouped">
                        <div class="control">
                          <RadioButton
                            selectedValue={
                              groupTypeDecisions[requestedGroupType._id]
                            }
                            valueKey={requestedGroupType._id}
                            value="Accept"
                            handleClick={handleGroupTypeDecided}
                          />
                        </div>
                        <div class="control">
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
              class="control has-text-centered has-margin-top-4"
              onClick={() => onSubmitGroupTypes()}
            >
              <button class="button is-primary" type="button">
                Submit
              </button>
            </div>
          </Fragment>
        ) : (
          <h2 className="is-size-4">No new Requested Group Types</h2>
        )}
      </div>
    </section>
  );
};

Admin.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getRequestedGroupTypes: PropTypes.func.isRequired,
  processRequestedGroupTypes: PropTypes.func.isRequired
};

export default connect(
  null,
  { getRequestedGroupTypes, processRequestedGroupTypes, loadUser }
)(Admin);
