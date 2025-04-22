const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function loadReports() {
  const container = document.getElementById("reports-container");
  container.innerHTML = "Loading reports...";

  try {
    const reportsRef = collection(db, "adherence");
    const snapshot = await getDocs(reportsRef);

    
    if (snapshot.empty) {
      container.innerHTML = "<p>No reports available.</p>";
      return;
    }

    container.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const reportEl = document.createElement("div");
      reportEl.classList.add("report");

      reportEl.innerHTML = `
        <h3>${data.patient_name}</h3>
        <p>
          Medication: ${data.medication_taken || "N/A"}<br>
          Dosage: ${data.dosage || "N/A"}<br>
          Time Taken: ${data.time || "N/A"}<br>
          Day: ${data.day || "N/A"}<br>
        </p>
      `;

      container.appendChild(reportEl);
    });

  } catch (error) {
    console.error("Error fetching reports:", error);
    container.innerHTML = "<p>Error loading reports.</p>";
  }
}

loadReports();
module.exports = { loadReports };
