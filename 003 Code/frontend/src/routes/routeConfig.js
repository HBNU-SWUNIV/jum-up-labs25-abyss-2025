// src/routes/routeConfig.js
import React from "react";

const Home        = React.lazy(() => import("../pages/Home/Home"));
const Dashboard   = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const Data        = React.lazy(() => import("../pages/Data/Data"));
const Plugin      = React.lazy(() => import("../pages/Plugin/Plugin"));
const Setting     = React.lazy(() => import("../pages/Setting/Setting"));
const User        = React.lazy(() => import("../pages/User/User"));
const Login       = React.lazy(() => import("../pages/Login/Login"));
const Unauthorized= React.lazy(() => import("../pages/Unauthorized/Unauthorized"));

/** meta.roles: ['admin'] 면 관리자 전용 */
export const routes = [
  { path: "/login",        element: <Login />,        meta: { public: true } },
  { path: "/unauthorized", element: <Unauthorized />, meta: { public: true } },

  { path: "/home",      element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/data",      element: <Data /> },
  { path: "/plugin",    element: <Plugin /> },
  { path: "/setting",   element: <Setting /> },

  { path: "/user",      element: <User />,           meta: { roles: ["admin"] } },
];
