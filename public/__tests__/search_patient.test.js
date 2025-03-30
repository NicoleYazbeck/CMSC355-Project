/**
 * @jest-environment jsdom
 */

const { displayResults } = require("../Sprint 1/search_patient.js");

describe("displayResults", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="results"></div>
        `;
    });

    test("should show matched patient details", () => {
        const mockPatients = [
            { name: "John Doe", dob: "1990-01-01", medical_conditions: ["Diabetes", "Hypertension"] }
        ];

        displayResults("john", mockPatients);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("John Doe");
        expect(results).toContain("1990-01-01");
        expect(results).toContain("Diabetes, Hypertension");
    });

    test("should be case-insensitive", () => {
        const mockPatients = [
            { name: "Jane Smith", dob: "1985-06-15", medical_conditions: ["Asthma"] }
        ];

        displayResults("JANE", mockPatients);
        expect(document.getElementById("results").innerHTML).toContain("Jane Smith");
    });

    test("should display 'No patients found.' when no match", () => {
        const mockPatients = [
            { name: "Alice Johnson", dob: "1975-03-10", medical_conditions: [] }
        ];

        displayResults("bob", mockPatients);
        expect(document.getElementById("results").innerHTML).toContain("No patients found.");
    });

    test("should display patient with empty medical conditions", () => {
        const mockPatients = [
            { name: "Alice Johnson", dob: "1975-03-10", medical_conditions: [] }
        ];

        displayResults("alice", mockPatients);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("Alice Johnson");
        expect(results).toContain("1975-03-10");
        expect(results).toContain("Conditions: ");
    });
});
