import React from "react";
import { Link } from "react-router-dom";

function Folder({ folder }) {
  return (
    <div>
      <Link to={`/folder/${folder.id}`}>{folder.name}</Link>
    </div>
  );
}

export default Folder;
