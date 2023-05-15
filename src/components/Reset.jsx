import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";

function Reset() {
  const [email, setEmail] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]); // eslint-disable-line

  return (
    <div className="form">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail Address"
      />
      <button onClick={() => sendPasswordReset(email)}>
        Send password reset email
      </button>
      <div>
        Don't have an account? <Link to="/register">Register</Link> now.
      </div>
    </div>
  );
}
export default Reset;
