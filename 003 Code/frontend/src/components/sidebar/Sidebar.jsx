// FMDS_2.0/frontend/src/components/sidebar/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

// Icons
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DashboardIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import DataIcon from "@mui/icons-material/Dataset";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";

import { useAuth } from "hooks/useAuth";

export default function Sidebar() {
  const { userRole } = useAuth(); // 'admin'이면 User 메뉴 노출

  const menu = [
    { to: "/home",      label: "Home",      icon: <HomeWorkIcon className="sidebarIcon" /> },
    { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon className="sidebarIcon" /> },
    { to: "/data",      label: "Data",      icon: <DataIcon className="sidebarIcon" /> },
    { to: "/plugin",    label: "Plugin",    icon: <AddBoxIcon className="sidebarIcon" /> },
    // roles 제한: admin만 보이도록
    { to: "/user",      label: "User",      icon: <GroupIcon className="sidebarIcon" />, roles: ["admin"] },
    { to: "/setting",   label: "Setting",   icon: <SettingsIcon className="sidebarIcon" /> },
  ];

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebarWrapper">
        {/* 상단 사용자 영역 제거 → 심플 로고 텍스트만 */}
        {/* <div className="brand">FMDS</div> */}

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            {menu
              .filter((item) => !item.roles || item.roles.includes(userRole))
              .map(({ to, label, icon }) => (
                <li key={to} className="sidebarListItem">
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) =>
                      `sidebarLink ${isActive ? "active" : ""}`
                    }
                    aria-label={label}
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
