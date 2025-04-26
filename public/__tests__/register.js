const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, query, where } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB9NTiW0H0Wd0ihUWcWM3nQPNWKQN_uMUQ",
  authDomain: "cmsc355project2.firebaseapp.com",
  databaseURL: "https://cmsc355project2-default-rtdb.firebaseio.com",
  projectId: "cmsc355project2",
  storageBucket: "cmsc355project2.firebasestorage.app",
  messagingSenderId: "865264890690",
  appId: "1:865264890690:web:5d15c22c73adb85fd18edb",
  measurementId: "G-DGWF7B0EBH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function registerPatient(event, document) {
  event.preventDefault();
  
  const username = document.getElementById("username").value;
  const usersCollection = collection(db, "users");
  const usernameQuery = query(usersCollection, where("username", "==", username));
  const usernameSnapshot = await getDocs(usernameQuery);
  
  if (!usernameSnapshot.empty) {
    document.getElementById("error-message").innerText = "Username already taken.";
    return;
  }

  try {
    // Register the patient and create an auth record
    await addDoc(usersCollection, {
      username: username,
      // other patient data
    });

    alert("Registration successful!");
    window.location.href = "login.html"; // Redirect to login
  } catch (error) {
    document.getElementById("error-message").innerText = `Error: ${error.message}`;
  }
}

function calculateDOB(age) {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = String(today.getMonth() + 1).padStart(2, '0');  // Ensure 2-digit month
  const day = String(today.getDate()).padStart(2, '0');         // Ensure 2-digit day
  return `${year}-${month}-${day}`;
}

module.exports = { registerPatient, calculateDOB,  db };