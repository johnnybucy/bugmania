import React, { useState } from "react";
import { supabase } from "../supabaseClient";  // import supabase client

function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { error, user } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Logged in as:", user);
      onClose();  // Close the modal after successful login
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <h2>Log In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Log In</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default LoginModal;
