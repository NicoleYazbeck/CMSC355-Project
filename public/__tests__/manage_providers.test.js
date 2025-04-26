/**
 * @jest-environment jsdom
 */

const { displayProviderResults } = require("./manage_providers.js");

describe("displayProviderResults (manageProviders)", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="results"></div>`;
    });

    test("should show matched provider details", () => {
        const mockProviders = [
            { name: "Dr. John Smith", email: "john.smith@example.com" }
        ];

        displayProviderResults("john", mockProviders);
        const results = document.getElementById("results").innerHTML;

        expect(results).toContain("Dr. John Smith");
        expect(results).toContain("john.smith@example.com");
    });

    test("should be case-insensitive", () => {
        const mockProviders = [
            { name: "Dr. Jane Doe", email: "jane.doe@example.com" }
        ];

        displayProviderResults("JANE".toLowerCase(), mockProviders);
        expect(document.getElementById("results").innerHTML).toContain("Dr. Jane Doe");
    });

    test("should display 'No providers found.' when no match", () => {
        const mockProviders = [
            { name: "Dr. Alice Blue", email: "alice.blue@example.com" }
        ];

        displayProviderResults("nonexistent", mockProviders);
        expect(document.getElementById("results").innerHTML).toContain("No providers found.");
    });
});
