import React, { useEffect, useRef } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import { consumerRoutes } from "routes.js";

function Consumer({ refresh }) {
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;

    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }

    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  const getRoutes = () =>
    consumerRoutes
      .filter((route) => route.layout === "/consumer" && route.component)
      .map((route) => (
        <Route
          key={route.path}
          path={route.path.replace(/^\//, "")}
          element={<route.component />}
        />
      ));

  const getBrandText = (pathname) => {
    const match = consumerRoutes.find(
      (route) =>
        route.layout === "/consumer" &&
        pathname.startsWith(route.layout + route.path),
    );

    return match ? match.name : "Farmer Helper";
  };

  return (
    <>
      <Sidebar
        routes={consumerRoutes}
        refresh={refresh}
        logo={{
          innerLink: "/consumer/index",
        }}
      />

      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          brandText={getBrandText(location.pathname)}
          refresh={refresh}
        />

        <Routes>
          {getRoutes()}
          <Route path="*" element={<Navigate to="/consumer/index" replace />} />
        </Routes>

        <div className="container-fluid">
          <AdminFooter />
        </div>
      </div>
    </>
  );
}

export default Consumer;
