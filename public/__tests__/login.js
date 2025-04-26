// login.js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

// (Optional: your Firebase config goes somewhere here)
// initializeApp(firebaseConfig);

export async function loginUser(email, password) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", userCredential.user.uid);
    // Redirect to user menu or dashboard here if needed
  } catch (error) {
    console.error("Login failed:", error.message);
    // Optionally show error to the user
  }
}
