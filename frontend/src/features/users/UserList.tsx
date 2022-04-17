import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { AllUsersDocument } from "../../types";
import { activeUserFilter } from "../../utils/users";

const UserList = () => {
  const { data, loading } = useQuery(AllUsersDocument);
  const [showAll, setShowAll] = useState(false);

  if (loading) return <div>Loading...</div>;

  const allUsers = data?.allUsers || [];
  const users = showAll ? allUsers : allUsers.filter((u) => activeUserFilter(u));
  return (
    <div>
      <h2>Folk</h2>
      <button type="button" onClick={() => setShowAll(!showAll)}>
        {showAll ? "Skjul gamliser" : "Vis alle"}
      </button>
      <ul>
        {(users || []).map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>
              {user.firstName} {user.lastName}
            </Link>
          </li>
        ))}
      </ul>
      <br />
      <Link to="/users/create" className="btn-primary">
        Opprett ny
      </Link>
    </div>
  );
};
export default UserList;
