import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export function calculateDOB(age) {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function registerPatient(event, document) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = parseInt(document.getElementById("age").value);
  const patient_id = parseInt(document.getElementById("patient_id").value);
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error-message");

  const dob = calculateDOB(age);

  try {
    const authSnap = await db.collection("auth")
      .where("username", "==", username)
      .get();

    if (!authSnap.empty) {
      errorEl.innerText = "Username already taken.";
      return;
    }

    await db.collection("users").add({
      id: patient_id,
      name: name,
      email: email,
      age: age,
      dob: dob,
      medications: []
    });

    await db.collection("auth").add({
      id: patient_id,
      username: username,
      password: password,
      role: "patient"
    });

    alert("Registration successful!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error during registration:", error);
    errorEl.innerText = "Error: " + error.message;
  }
}
