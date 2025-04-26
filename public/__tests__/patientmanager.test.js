/**
 * @jest-environment jsdom
 */

const { displayPatientManagementResults } = require("./manage_patients.js");

describe("displayPatientManagementResults (managePatients)", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="results"></div>`;
    });

    test("should show matched patient details", () => {
        const mockPatients = [
            { name: "John Doe", dob: "1990-01-01" }
        ];

        displayPatientManagementResults("john", mockPatients);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("John Doe");
        expect(results).toContain("1990-01-01");
    });

    test("should be case-insensitive", () => {
        const mockPatients = [
            { name: "Jane Smith", dob: "1985-06-15" }
        ];

        displayPatientManagementResults("JANE".toLowerCase(), mockPatients);
        expect(document.getElementById("results").innerHTML).toContain("Jane Smith");
    });

    test("should display 'No patients found.' when no match", () => {
        const mockPatients = [
            { name: "Alice Johnson", dob: "1975-03-10" }
        ];

        displayPatientManagementResults("nonexistent", mockPatients);
        expect(document.getElementById("results").innerHTML).toContain("No patients found.");
    });
});
