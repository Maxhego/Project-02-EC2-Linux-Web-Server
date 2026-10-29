document.addEventListener("DOMContentLoaded", () => {
    const updated = document.getElementById("last-updated");

    if (updated) {
        updated.textContent = new Date().toLocaleString();
    }

    console.log("AWS Project 02 dashboard loaded successfully.");
});
