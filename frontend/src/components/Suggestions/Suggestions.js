import React, { useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

import Temperature from "./Temperature";
import Rainfall from "./Rainfall";
import Location from "./Location";

function Suggestions() {
  const [activeTab, setActiveTab] = useState("temperature");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-transparent">
        <div className="row align-items-center">
          <div className="col">
            <h3 className="mb-0">Farming Suggestions</h3>
          </div>

          <div className="col-auto">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "temperature",
                  })}
                  onClick={() => toggleTab("temperature")}
                >
                  Temperature
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "rainfall",
                  })}
                  onClick={() => toggleTab("rainfall")}
                >
                  Rainfall
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "location",
                  })}
                  onClick={() => toggleTab("location")}
                >
                  Location
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>

      <div className="card-body">
        {activeTab === "temperature" && <Temperature />}
        {activeTab === "rainfall" && <Rainfall />}
        {activeTab === "location" && <Location />}
      </div>
    </div>
  );
}

export default Suggestions;
