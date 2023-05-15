import React from "react";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";

function BreadCrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];

  if (currentFolder) path = [...path, ...currentFolder.path];

  return (
    <div className="breadcrumbs">
      {path.map((folder) => (
        <>
          <Link key={folder.id} to={folder.id ? `/folder/${folder.id}` : "/"}>
            {folder.name}
          </Link>
          <span>/</span>
        </>
      ))}
      {currentFolder && <span>{currentFolder.name}</span>}
    </div>
  );
}

export default BreadCrumbs;
