async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("data.json");
        const data = await response.json();
        checkIfUserExists(username, password, data);
    } catch (error) {
        console.error("Error loading user data:", error);
        document.getElementById("error-message").innerText = "Error loading user data.";
    }
}
function checkIfUserExists(username, password, data) {
    const user = data.auth.users.find(u => u.username === username && u.password === password);

    if (user) {
        alert("Login successful! Redirecting...");
        window.location.href = user.role === "patient" ? "patient_menu.html" : "provider_menu.html";
        return 0;
    } else {
        document.getElementById("error-message").innerText = "Invalid username or password.";
        return 1;
    }
}

// ✅ Use CommonJS export
module.exports = { login, checkIfUserExists };
