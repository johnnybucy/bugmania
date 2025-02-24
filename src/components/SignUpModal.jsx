import React, { useState } from "react";
import { supabase } from "../supabaseClient";  // import supabase client

function SignUpModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);  // For handling error messages
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous error

    try {
      console.log("Attempting sign up...");  // Log to check the flow

      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      // Log the user and error objects for debugging
      console.log("User:", user);
      console.log("SignUp Error:", signUpError);

      if (signUpError) {
        throw new Error(signUpError.message); // Throw an error if sign-up fails
      }

      // After successful sign-up, add username to profile (optional)
      if (user) {
        const { error: updateError } = await supabase
          .from("Users")  // Assuming you have a "Users" table
          .upsert([
            {
              id: user.id,  // Ensure user.id is available after sign-up
              username: username,
              email: email,
            },
          ]);

        console.log("Update Error:", updateError);  // Log any errors when updating

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Close modal after successful sign-up
        onClose();
      }
    } catch (err) {
      console.error("Sign-up failed:", err.message);  // Log the error
      setError(err.message);  // Set the error message if something goes wrong
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}  {/* Display error message */}
        <form onSubmit={handleSignUp}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
