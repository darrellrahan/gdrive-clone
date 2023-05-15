import React, { useState } from "react";
import { addFolder, auth } from "../firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { useAuthState } from "react-firebase-hooks/auth";

function ModalFolder({ isModal, setIsModal, folder }) {
  const [user] = useAuthState(auth);
  const [folderName, setFolderName] = useState("");

  function addFolderLocal() {
    if (folderName === "") alert("fill folder name!");
    else {
      const path = [...folder.path];
      if (folder !== ROOT_FOLDER) {
        path.push({ name: folder.name, id: folder.id });
      }
      addFolder(folderName, user.uid, folder, path);
      setFolderName("");
      setIsModal(false);
    }
  }

  if (!isModal) return;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Add Folder</h2>
        <input
          type="text"
          onChange={(e) => setFolderName(e.target.value)}
          value={folderName}
          placeholder="Enter Folder Name"
          style={{ width: "100%" }}
          className="folder-name-input"
        />
        <div className="justify-between">
          <div></div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="green-outline-btn"
              onClick={() => setIsModal(false)}
            >
              Close
            </button>
            <button className="green-primary-btn" onClick={addFolderLocal}>
              Add Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalFolder;
