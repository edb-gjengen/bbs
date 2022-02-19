import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

import { UserCreate } from "./features/auth/UserCreate";
import { Deposit } from "./features/deposit/Deposit";
import { Log } from "./features/log/Log";
import { Register } from "./features/register/Register";
import { OrderStats } from "./features/stats/OrderStats";
import { ProductStats } from "./features/stats/ProductStats";
import { Stats } from "./features/stats/Stats";
import { UserDetail } from "./features/users/UserDetail";
import { UserList } from "./features/users/UserList";

export const Routes: React.FC = () => (
  <ReactRouterRoutes>
    <Route path="/deposit" element={<Deposit />} />
    <Route path="/log" element={<Log />} />
    <Route path="/stats" element={<Stats />} />
    <Route path="/stats/orders" element={<OrderStats />} />
    <Route path="/stats/products" element={<ProductStats />} />
    <Route path="/users" element={<UserList />} />
    <Route path="/users/create" element={<UserCreate />} />
    <Route path="/user/:userId" element={<UserDetail />} />
    <Route path="/" element={<Register />} />
  </ReactRouterRoutes>
);
