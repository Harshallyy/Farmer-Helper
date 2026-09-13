import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  Container,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media,
} from "reactstrap";

import { BASE_URL } from "Common/Constants";
import { getErrorMessage } from "Common/api";

import "./AdminNavbar.css";

function AdminNavbar({ brandText, refresh }) {
  const [username, setUsername] = useState("User");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const role = location.pathname.startsWith("/consumer")
    ? "consumer"
    : "farmer";

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${role}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (mounted && response.data?.statusCode === 200) {
          setUsername(response.data?.result?.username || "User");
        }
      } catch (error) {
        if (mounted) {
          setUsername("User");
          console.error(getErrorMessage(error));
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    refresh();
  };

  useEffect(() => {
    const syncMobileOpen = (event) => {
      const nextState =
        event?.detail && typeof event.detail.open === "boolean"
          ? event.detail.open
          : false;

      setMobileSidebarOpen(nextState);
    };

    const closeMobile = () => setMobileSidebarOpen(false);

    window.addEventListener("fh:sidebar-state", syncMobileOpen);
    window.addEventListener("fh:close-sidebar", closeMobile);

    return () => {
      window.removeEventListener("fh:sidebar-state", syncMobileOpen);
      window.removeEventListener("fh:close-sidebar", closeMobile);
    };
  }, []);

  const openMobileSidebar = () => {
    const nextState = !mobileSidebarOpen;
    setMobileSidebarOpen(nextState);
    window.dispatchEvent(
      new CustomEvent("fh:toggle-sidebar", { detail: { open: nextState } }),
    );
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
    window.dispatchEvent(new CustomEvent("fh:close-sidebar"));
  };

  return (
    <Navbar
      className="navbar-top fh-admin-navbar"
      expand={false}
      id="navbar-main"
    >
      <Container fluid>
        {/* Desktop page title */}
        <Link className="fh-navbar-title" to={`/${role}/index`}>
          <span className="fh-navbar-title-icon">
            <i className="fas fa-seedling" />
          </span>

          <span>{brandText}</span>
        </Link>

        {/* Mobile brand */}
        <Link
          className="fh-mobile-brand"
          to={`/${role}/index`}
          onClick={closeMobileSidebar}
        >
          <span className="fh-mobile-brand-icon">
            <i className="fas fa-seedling" />
          </span>

          <span>Farmer Helper</span>
        </Link>

        {/* Desktop user */}
        <Nav className="align-items-center ml-auto" navbar>
          <div className="d-none d-lg-block">
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="Profile"
                      src={require("../../assets/img/theme/person.jpg")}
                    />
                  </span>

                  <Media className="ml-2">
                    <span className="mb-0 text-sm font-weight-bold fh-navbar-user">
                      {username}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>

              <DropdownMenu end>
                <DropdownItem to={`/${role}/user-profile`} tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>

                <DropdownItem divider />

                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="fh-mobile-sidebar-btn"
          aria-label={
            mobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileSidebarOpen}
          aria-controls="sidenav-main"
          onClick={openMobileSidebar}
        >
          <span />
          <span />
          <span />
        </button>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
