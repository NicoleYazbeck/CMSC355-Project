// For searching medications from the webpage
async function searchMedication() {
    const name = document.getElementById("searchMedication").value.toLowerCase();
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        displayMedicationResults(name, data.medications);
    } catch (error) {
        console.error("Error loading medication data:", error);
        document.getElementById("results").innerHTML = "<p>Error loading medication data.</p>";
    }
}

// For displaying search results (used for both web and testing)
function displayMedicationResults(searchName, medications) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const matched = medications.filter(med =>
        med.name.toLowerCase().includes(searchName)
    );

    if (matched.length === 0) {
        resultsDiv.innerHTML = "<p>No medications found.</p>";
    } else {
        matched.forEach(med => {
            const entry = document.createElement("div");
            entry.innerHTML = `<strong>${med.name}</strong><br>Description: ${med.description}`;
            resultsDiv.appendChild(entry);
            resultsDiv.appendChild(document.createElement("hr"));
        });
    }
}

module.exports = { searchMedication, displayMedicationResults };
