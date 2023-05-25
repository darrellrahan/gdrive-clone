import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, logout, storage } from "../firebase";
import { ROOT_FOLDER, useFolder } from "../hooks/useFolder";
import BreadCrumbs from "./BreadCrumbs";
import Folder from "./Folder";
import { AiFillFolderAdd, AiFillFileAdd } from "react-icons/ai";
import ModalFolder from "./ModalFolder";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import File from "./File";

function Dashboard() {
  const { folderId } = useParams();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { folder, childFolders, childFiles } = useFolder(folderId);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]); // eslint-disable-line

  function uploadFile(e) {
    const file = e.target.files[0];
    if (!folder || !file) return;

    const filePath =
      folder === ROOT_FOLDER
        ? `${folder.path.join("/")}/${file.name}`
        : `${folder.path.join("/")}/${folder.name}/${file.name}`;

    const storageRef = ref(storage, `/files/${user.uid}/${filePath}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (e) => alert(e),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
          await addDoc(collection(db, "files"), {
            url: downloadUrl,
            name: file.name,
            createdAt: serverTimestamp(),
            folderId: folder.id,
            userId: user.uid,
          });
        });
      }
    );
  }

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
              onChange={uploadFile}
              style={{ opacity: "0", position: "absolute", left: "-9999px" }}
            />
          </label>
          <button onClick={() => setIsModal(true)} className="add-btn">
            <AiFillFolderAdd />
          </button>
        </div>
      </div>
      <ModalFolder isModal={isModal} setIsModal={setIsModal} folder={folder} />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "0 1.5rem",
          flexWrap: "wrap",
        }}
      >
        {childFolders.length > 0 &&
          childFolders.map((childFolder) => (
            <Folder key={childFolder.id} folder={childFolder} />
          ))}
      </div>
      {childFolders.length > 0 && childFiles.length > 0 ? (
        <hr style={{ margin: "2rem 1.5rem" }} />
      ) : null}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "0 1.5rem",
          flexWrap: "wrap",
        }}
      >
        {childFiles.length > 0 &&
          childFiles.map((childFile) => (
            <File key={childFile.id} file={childFile} />
          ))}
      </div>
    </div>
  );
}
export default Dashboard;
