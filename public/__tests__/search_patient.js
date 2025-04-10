//For testing using Jest

async function searchPatient() {
    const name = document.getElementById("searchName").value.toLowerCase();
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        displayResults(name, data.patients);
    } catch (error) {
        console.error("Error loading patient data:", error);
        document.getElementById("results").innerHTML = "<p>Error loading patient data.</p>";
    }
}

function displayResults(searchName, patients) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    const matched = patients.filter(p =>
        p.name.toLowerCase().includes(searchName)
    );
    if (matched.length === 0) {
        resultsDiv.innerHTML = "<p>No patients found.</p>";
    } else {
        matched.forEach(p => {
            const entry = document.createElement("div");
            entry.innerHTML = `<strong>${p.name}</strong><br>DOB: ${p.dob}<br>Conditions: ${p.medical_conditions.join(", ")}`;
            resultsDiv.appendChild(entry);
            resultsDiv.appendChild(document.createElement("hr"));
        });
    }
}

module.exports = { searchPatient, displayResults };