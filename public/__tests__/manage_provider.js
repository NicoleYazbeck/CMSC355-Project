function displayProviderResults(searchName, providers) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const matched = providers.filter(p =>
        p.name.toLowerCase().includes(searchName)
    );

    if (matched.length === 0) {
        resultsDiv.innerHTML = "<p>No providers found.</p>";
    } else {
        matched.forEach(p => {
            const entry = document.createElement("div");
            entry.innerHTML = `<strong>${p.name}</strong><br>Email: ${p.email}`;
            resultsDiv.appendChild(entry);
            resultsDiv.appendChild(document.createElement("hr"));
        });
    }
}

module.exports = { displayProviderResults };
