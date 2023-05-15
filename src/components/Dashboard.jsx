import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useFolder } from "../hooks/useFolder";
import BreadCrumbs from "./BreadCrumbs";
import Folder from "./Folder";
import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
import ModalFolder from "./ModalFolder";

function Dashboard() {
  const { folderId } = useParams();
  const [user] = useAuthState(auth);
  const [isModal, setIsModal] = useState(false);
  const navigate = useNavigate();
  const { folder, childFolders } = useFolder(folderId);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]); // eslint-disable-line

  return (
    <div className="dashboard">
      <div className="header justify-between">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <div className="text-right">
          <p>{user?.displayName}</p>
          <p>{user?.email}</p>
        </div>
      </div>
      <div
        className="justify-between"
        style={{ margin: "1.25rem 1.5rem 1.75rem 1.5rem" }}
      >
        <BreadCrumbs currentFolder={folder} />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <label className="add-btn">
            <AiFillFileAdd />
            <input
              type="file"
              style={{ opacity: "0", position: "absolute", left: "-9999px" }}
            />
          </label>
          <button onClick={() => setIsModal(true)} className="add-btn">
            <AiFillFolderAdd />
          </button>
        </div>
      </div>
      <ModalFolder isModal={isModal} setIsModal={setIsModal} folder={folder} />
      <div style={{ display: "flex", gap: "1rem", margin: "0 1.5rem" }}>
        {childFolders.length > 0 &&
          childFolders.map((childFolder) => (
            <Folder key={childFolder.id} folder={childFolder} />
          ))}
      </div>
    </div>
  );
}
export default Dashboard;
