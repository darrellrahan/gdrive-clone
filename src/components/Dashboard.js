import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { addFolder, auth, logout } from "../firebase";
import { ROOT_FOLDER, useFolder } from "../hooks/useFolder";
import BreadCrumbs from "./BreadCrumbs";
import Folder from "./Folder";

function Dashboard() {
  const { folderId } = useParams();
  const [user] = useAuthState(auth);
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();
  const { folder, childFolders } = useFolder(folderId);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]); // eslint-disable-line

  return (
    <div>
      <h1>Logged in as</h1>
      <div>{user?.displayName}</div>
      <div>{user?.email}</div>
      <input
        type="text"
        onChange={(e) => setFolderName(e.target.value)}
        value={folderName}
        placeholder="folder name"
      />
      <button
        onClick={() => {
          if (folderName === "") alert("fill folder name!");
          else {
            const path = [...folder.path];
            if (folder !== ROOT_FOLDER) {
              path.push({ name: folder.name, id: folder.id });
            }
            addFolder(folderName, user.uid, folder, path);
            setFolderName("");
          }
        }}
      >
        Add Folder
      </button>
      <button className="dashboard__btn" onClick={logout}>
        Logout
      </button>
      <BreadCrumbs currentFolder={folder} />
      {childFolders.length > 0 &&
        childFolders.map((childFolder) => (
          <Folder key={childFolder.id} folder={childFolder} />
        ))}
    </div>
  );
}
export default Dashboard;
