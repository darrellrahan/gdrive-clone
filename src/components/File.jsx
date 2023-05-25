import React from "react";
import { AiFillFile } from "react-icons/ai";

function File({ file }) {
  return (
    <a href={file.url} target="_blank" rel="noreferrer" className="folder">
      <AiFillFile fontSize="1.5rem" />
      <span>{file.name}</span>
    </a>
  );
}

export default File;
