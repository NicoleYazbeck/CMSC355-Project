import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        query,
        where,
        getDocs,
        addDoc,
        deleteDoc,
        doc
      } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  
      const firebaseConfig = {
        apiKey: "AIzaSyB9NTiW0H0Wd0ihUWcWM3nQPNWKQN_uMUQ",
        authDomain: "cmsc355project2.firebaseapp.com",
        projectId: "cmsc355project2",
        storageBucket: "cmsc355project2.appspot.com",
        messagingSenderId: "865264890690",
        appId: "1:865264890690:web:5d15c22c73adb85fd18edb",
        measurementId: "G-DGWF7B0EBH"
      };
  
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const remindersRef = collection(db, "reminders");
  
      let currentPatientId = null;
  
      const loadBtn = document.getElementById("loadRemindersBtn");
      const addBtn = document.getElementById("addReminderBtn");
      const reminderList = document.getElementById("reminderList");
      const formSection = document.getElementById("reminderForm");
  
      async function loadReminders(patientId) {
        const q = query(remindersRef, where("patient_id", "==", patientId));
        const snapshot = await getDocs(q);
  
        reminderList.innerHTML = "";
  
        if (snapshot.empty) {
          reminderList.innerHTML = "<li>No reminders found.</li>";
          return;
        }
  
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${data.name}</strong> - ${data.dosage} at ${data.time}
            <br>
            <button onclick="deleteReminder('${docSnap.id}')">Delete</button>
          `;
          reminderList.appendChild(li);
        });
      }
  
      window.deleteReminder = async (id) => {
        await deleteDoc(doc(db, "reminders", id));
        await loadReminders(currentPatientId);
      };
  
      loadBtn.addEventListener("click", async () => {
        const idInput = document.getElementById("patientId").value.trim();
        if (!idInput) {
          alert("Please enter a patient ID.");
          return;
        }
        currentPatientId = parseInt(idInput);
        formSection.classList.remove("hidden");
        await loadReminders(currentPatientId);
      });
  
      addBtn.addEventListener("click", async () => {
        const name = document.getElementById("medication").value.trim();
        const dosage = document.getElementById("dosage").value.trim();
        const time = document.getElementById("reminderTime").value.trim();
  
        if (!name || !dosage || !time || !currentPatientId) {
          alert("Please fill in all fields.");
          return;
        }
  
        await addDoc(remindersRef, {
          name,
          dosage,
          time,
          patient_id: currentPatientId
        });
  
        document.getElementById("medication").value = "";
        document.getElementById("dosage").value = "";
        document.getElementById("reminderTime").value = "";
  
        await loadReminders(currentPatientId);
      });
