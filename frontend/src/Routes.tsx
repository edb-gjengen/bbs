import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

import { Deposit } from "./features/deposit/Deposit";
import { Log } from "./features/log/Log";
import { Register } from "./features/register/Register";

export const Routes: React.FC = () => (
  <ReactRouterRoutes>
    <Route path="/deposit" element={<Deposit />} />
    <Route path="/log" element={<Log />} />
    <Route path="/" element={<Register />} />
  </ReactRouterRoutes>
);
