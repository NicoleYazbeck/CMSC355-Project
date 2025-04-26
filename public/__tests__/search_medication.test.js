/**
 * @jest-environment jsdom
 */

const { displayMedicationResults } = require("./search_medication.js");

describe("displayMedicationResults (searchMedication)", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="results"></div>`;
    });

    test("should show matched medication details", () => {
        const mockMedications = [
            { name: "Aspirin", description: "Pain reliever" }
        ];

        displayMedicationResults("aspirin", mockMedications);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("Aspirin");
        expect(results).toContain("Pain reliever");
    });

    test("should be case-insensitive", () => {
        const mockMedications = [
            { name: "Ibuprofen", description: "Anti-inflammatory" }
        ];

        displayMedicationResults("IBUPROFEN".toLowerCase(), mockMedications);
        expect(document.getElementById("results").innerHTML).toContain("Ibuprofen");
    });

    test("should display 'No medications found.' when no match", () => {
        const mockMedications = [
            { name: "Paracetamol", description: "Fever reducer" }
        ];

        displayMedicationResults("nonexistent", mockMedications);
        expect(document.getElementById("results").innerHTML).toContain("No medications found.");
    });

    test("should handle multiple medication matches", () => {
        const mockMedications = [
            { name: "Tylenol", description: "Pain reliever" },
            { name: "Tylenol PM", description: "Pain reliever and sleep aid" }
        ];

        displayMedicationResults("tylenol", mockMedications);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("Tylenol");
        expect(results).toContain("Tylenol PM");
    });
});
