import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useReducer, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders",
  SET_CHILD_FILES: "set-child-files",
};

export const ROOT_FOLDER = { name: "Root", id: null, path: [] };

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
}

export function useFolder(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folderId, folder]);

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    async function getFolder(folderId) {
      const docRef = doc(db, "folders", folderId);
      await getDoc(docRef)
        .then((doc) => {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: { id: doc.id, ...doc.data() } },
          });
        })
        .catch((e) => {
          alert(e.message);
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: ROOT_FOLDER },
          });
        });
    }

    getFolder(folderId);
  }, [folderId]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "folders"),
      where("parentId", "==", folderId),
      where("uid", "==", user.uid),
      orderBy("createdAt")
    );

    return onSnapshot(q, (querySnapshot) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDERS,
        payload: {
          childFolders: querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
        },
      });
    });
  }, [folderId, user]);

  return state;
}
