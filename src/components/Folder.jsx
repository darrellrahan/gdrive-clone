import React from "react";
import { Link } from "react-router-dom";
import { AiFillFolder } from "react-icons/ai";

function Folder({ folder }) {
  return (
    <Link to={`/folder/${folder.id}`} className="folder">
      <AiFillFolder fontSize="1.5rem" />
      <span>{folder.name}</span>
    </Link>
  );
}

export default Folder;
