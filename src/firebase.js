import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1Hx0u16NxAkkkCPXqA4T-wIpf-IeAv4o",
  authDomain: "darrellrahan-gdrive.firebaseapp.com",
  projectId: "darrellrahan-gdrive",
  storageBucket: "darrellrahan-gdrive.appspot.com",
  messagingSenderId: "650673253551",
  appId: "1:650673253551:web:f53d987cbd5cb4a3ed785a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

async function addFolder(name, uid, currentFolder, path) {
  if (currentFolder === null) return;

  try {
    await addDoc(collection(db, "folders"), {
      name: name,
      uid: uid,
      parentId: currentFolder.id,
      path: path,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    alert("Error adding document: ", e);
  }
}
function signInWithGoogle() {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.log(error.message);
    });
}
async function logInWithEmailAndPassword(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err.message);
    alert(err.message);
  }
}
function registerWithEmailAndPassword(name, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(userCredential.user, { displayName: name });
    })
    .catch((error) => {
      console.log(error.message);
    });
}
async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (error) {
    console.error(error.message);
  }
}
function logout() {
  signOut(auth);
}

export {
  auth,
  addFolder,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
