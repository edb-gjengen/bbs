import React from "react";
import { Route, Switch } from "react-router-dom";

import { Deposit } from "./features/deposit/Deposit";
import { Register } from "./features/register/Register";

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/deposit" component={Deposit} />
    <Route path="/" exact component={Register} />
  </Switch>
);
