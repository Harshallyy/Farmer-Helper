import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/Admin";
import ConsumerLayout from "layouts/Consumer";
import AuthLayout from "layouts/Auth";

import axios from "axios";
import { BASE_URL } from "Common/Constants";

import "react-notifications-component/dist/theme.css";
import { ReactNotifications } from "react-notifications-component";
function App() {
  const [userType, setUserType] = useState("loading");

  const checkUser = useCallback(async () => {
    try {
      const res = await axios.post(`${BASE_URL}checkUser`, {
        token: localStorage.getItem("token"),
      });

      setUserType(res.data.user);
    } catch (err) {
      setUserType("guest");
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (userType === "loading") {
    return (
      <div className="app-boot-loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ReactNotifications />

      <Routes>
        {userType === "farmer" && (
          <>
            <Route
              path="/farmer/*"
              element={<AdminLayout refresh={checkUser} />}
            />
            <Route path="*" element={<Navigate to="/farmer/index" replace />} />
          </>
        )}

        {userType === "consumer" && (
          <>
            <Route
              path="/consumer/*"
              element={<ConsumerLayout refresh={checkUser} />}
            />
            <Route
              path="*"
              element={<Navigate to="/consumer/index" replace />}
            />
          </>
        )}

        {userType === "guest" && (
          <>
            <Route
              path="/auth/*"
              element={<AuthLayout refresh={checkUser} />}
            />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
