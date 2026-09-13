import React from "react";

function UserHeader({ username }) {
  return (
    <div className="fh-user-header">
      <div className="container-fluid">
        <div className="fh-user-header-inner">
          <div className="fh-user-header-icon">
            <i className="fas fa-user" />
          </div>

          <div>
            <p className="fh-user-header-kicker">Profile</p>
            <h1 className="fh-user-header-title">
              Hello {username || "there"}
            </h1>
            <p className="fh-user-header-copy">
              Manage your Farmer Helper account and saved preferences from here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
