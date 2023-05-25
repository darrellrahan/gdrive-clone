import React from "react";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";

function BreadCrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];

  if (currentFolder) path = [...path, ...currentFolder.path];

  return (
    <div className="breadcrumbs">
      {path.map((folder) => (
        <div
          key={folder.id}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Link to={folder.id ? `/folder/${folder.id}` : "/"}>
            {folder.name}
          </Link>
          <span>/</span>
        </div>
      ))}
      {currentFolder && <span>{currentFolder.name}</span>}
    </div>
  );
}

export default BreadCrumbs;
