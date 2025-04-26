const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9NTiW0H0Wd0ihUWcWM3nQPNWKQN_uMUQ",
  authDomain: "cmsc355project2.firebaseapp.com",
  databaseURL: "https://cmsc355project2-default-rtdb.firebaseio.com",
  projectId: "cmsc355project2",
  storageBucket: "cmsc355project2.appspot.com",
  messagingSenderId: "865264890690",
  appId: "1:865264890690:web:5d15c22c73adb85fd18edb",
  measurementId: "G-DGWF7B0EBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Login function
async function login(event) {
  event.preventDefault();

  const username = document.getElementById("login-username")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!username || !password) {
    document.getElementById("error-message").innerText = "Please enter username and password.";
    return;
  }

  const usersRef = collection(db, "auth");
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      alert("Login successful!");

      window.location.href = userData.role === "patient"
        ? "patient_menu.html"
        : "provider_menu.html";
    } else {
      document.getElementById("error-message").innerText = "Invalid username or password.";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("error-message").innerText = "Login failed. Please try again.";
  }
}

// Attach login function
const loginButton = document.getElementById('login-button');
if (loginButton) {
  loginButton.addEventListener('click', login);
}

// Export for tests
module.exports = { login };
