import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";  // import supabase client
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";  // import the Login Modal
import BugList from "./components/BugList";
import AddBug from "./components/AddBug";

function App() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);  // State for Login Modal
  const [user, setUser] = useState(null);

  // Listen to authentication state changes (onAuthStateChange)
  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);  // Update user state based on session
      }
    );

    // No need to manually unsubscribe. Supabase cleans up the listener automatically.

    return () => {
      // We don't need to unsubscribe manually in the current setup
    };
  }, []);

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);  // Open the Login Modal
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);  // Close the Login Modal
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);  // Clear user state
  };

  const [refreshBugs, setRefreshBugs] = useState(false);

  return (
    <div>
      <h1>Bug Tracker</h1>

      {/* Display User Info if Logged In */}
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div>
          <button onClick={openSignUpModal}>Sign Up</button>
          <button onClick={openLoginModal}>Log In</button>  {/* Open Login Modal */}
        </div>
      )}

      {/* Modals */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />  {/* Login Modal */}
      
      {user && <AddBug onBugAdded={() => setRefreshBugs(!refreshBugs)} />}
      {user && <BugList key={refreshBugs} />}
    </div>
  );
}

export default App;




