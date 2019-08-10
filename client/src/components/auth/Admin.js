import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getRequestedGroupTypes } from "../../actions/admin";
import { loadUser } from "../../actions/auth";
import NotFound from "../common/NotFound";
import RadioButton from "../common/RadioButton";

const Admin = ({ loadUser, getRequestedGroupTypes }) => {
  const [adminState, setAdminState] = useState({
    isAuthenticated: false,
    requestedGroupTypes: [],
    groupTypeDecisions: {}
  });

  const {
    requestedGroupTypes,
    isAuthenticated,
    groupTypeDecisions
  } = adminState;

  useEffect(() => {
    if (!isAuthenticated) {
      let fetchData = async () => {
        const loadUserResponse = await loadUser(true);

        setAdminState({ ...adminState, isAuthenticated: loadUserResponse });
      };

      fetchData();
    } else if (requestedGroupTypes) {
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
  }, [isAuthenticated]);

  const handleGroupTypeDecided = (decision, key) => {
    setAdminState({
      ...adminState,
      groupTypeDecisions: { ...groupTypeDecisions, [key]: decision }
    });

    console.log(groupTypeDecisions);
  };

  if (!isAuthenticated) {
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
                <td>
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
        {requestedGroupTypes && (
          <div className="content has-text-centered">
            <h3>- This is the end. -</h3>
          </div>
        )}
      </div>
    </section>
  );
};

Admin.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getRequestedGroupTypes: PropTypes.func.isRequired
};

export default connect(
  null,
  { getRequestedGroupTypes, loadUser }
)(Admin);
