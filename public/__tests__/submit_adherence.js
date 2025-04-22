const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB9NTiW0H0Wd0ihUWcWM3nQPNWKQN_uMUQ",
  authDomain: "cmsc355project2.firebaseapp.com",
  projectId: "cmsc355project2",
  storageBucket: "cmsc355project2.appspot.com",
  messagingSenderId: "865264890690",
  appId: "1:865264890690:web:5d15c22c73adb85fd18edb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function submitMedication({ patientName, medication, dosage, timeInput }) {
  if (!patientName || !medication || !dosage || !timeInput) {
    throw new Error("Please fill out all fields.");
  }

  const dateObj = new Date(timeInput);
  const day = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  await addDoc(collection(db, "adherence"), {
    patient_name: patientName,
    medication_taken: medication,
    dosage: dosage,
    time: time,
    day: day
  });

  return "Medication submission recorded successfully!";
}

module.exports = { submitMedication };
