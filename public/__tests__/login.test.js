/**
 * @jest-environment jsdom
 */

const { login, checkIfUserExists } = require("../Sprint 1/login.js");




// Mock DOM elements
beforeEach(() => {
    document.body.innerHTML = `
        <input id="username" value="testUser" />
        <input id="password" value="testPass" />
        <div id="error-message"></div>
    `;
});

describe("checkIfUserExists", () => {
    const mockData = {
        auth: {
            users: [
                { username: "testUser", password: "testPass", role: "patient" },
                { username: "admin", password: "adminPass", role: "provider" }
            ]
        }
    };

    test("should redirect for a valid patient login", () => {
        delete window.location;
        window.location = { href: "" }; // Mock window.location

        const result = checkIfUserExists("testUser", "testPass", mockData);
        expect(window.location.href).toBe("patient_menu.html");
    });

    test("should redirect for a valid provider login", () => {
        delete window.location;
        window.location = { href: "" }; // Mock window.location

        const result = checkIfUserExists("admin", "adminPass", mockData);
        expect(window.location.href).toBe("provider_menu.html");
    });

    test("should display an error message for invalid credentials", () => {
        const result = checkIfUserExists("wrongUser", "wrongPass", mockData);
        expect(document.getElementById("error-message").innerText).toBe("Invalid username or password.");
    });

    test("should display an error message for invalid credentials", () => {
        const result = checkIfUserExists("wrongUser", "testPass", mockData);
        expect(document.getElementById("error-message").innerText).toBe("Invalid username or password.");
    });

    test("should display an error message for invalid credentials", () => {
        const result = checkIfUserExists("testUser", "wrongPass", mockData);
        expect(document.getElementById("error-message").innerText).toBe("Invalid username or password.");
    });

    
});

describe("login", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    auth: {
                        users: [
                            { username: "testUser", password: "testPass", role: "patient" }
                        ]
                    }
                })
            })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    test("should display an error message if fetch fails", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Fetch error")));

        await login();
        expect(document.getElementById("error-message").innerText).toBe("Error loading user data.");
    });
});
