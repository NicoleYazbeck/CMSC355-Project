export function addProvider(document) {
    const name = document.getElementById("providerName").value;
    const contact = document.getElementById("contact").value;
  
    if (!name || !contact) {
      alert("Please fill out all fields.");
      return;
    }
  
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong><br>Contact: ${contact} <br><button onclick="this.parentElement.remove()">Remove</button>`;
    document.getElementById("providerList").appendChild(li);
  
    document.getElementById("providerName").value = "";
    document.getElementById("contact").value = "";
  }
  