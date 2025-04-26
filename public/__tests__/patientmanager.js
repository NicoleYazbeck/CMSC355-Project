function displayPatientManagementResults(searchName, patients) {
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
            entry.innerHTML = `<strong>${p.name}</strong><br>DOB: ${p.dob}`;
            resultsDiv.appendChild(entry);
            resultsDiv.appendChild(document.createElement("hr"));
        });
    }
}

module.exports = { displayPatientManagementResults }; 
