import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

import { Deposit } from "./features/deposit/Deposit";
import { Log } from "./features/log/Log";
import { Register } from "./features/register/Register";
import { Stats } from "./features/stats/Stats";
import { UserDetail } from "./features/users/UserDetail";
import { UserList } from "./features/users/UserList";

export const Routes: React.FC = () => (
  <ReactRouterRoutes>
    <Route path="/deposit" element={<Deposit />} />
    <Route path="/log" element={<Log />} />
    <Route path="/stats" element={<Stats />} />
    <Route path="/users" element={<UserList />} />
    <Route path="/user/:userId" element={<UserDetail />} />
    <Route path="/" element={<Register />} />
  </ReactRouterRoutes>
);
