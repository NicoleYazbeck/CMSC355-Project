/**
 * @jest-environment jsdom
 */

const { addProvider } = require("../Sprint 2/manage_provider.js");

describe("addProvider", () => {
  beforeEach(() => {
    // Set up mock DOM
    document.body.innerHTML = `
      <input type="text" id="providerName" value="Dr. Strange" />
      <input type="email" id="contact" value="strange@example.com" />
      <ul id="providerList"></ul>
    `;

    // Mock alert
    global.alert = jest.fn();
  });

  test("adds a provider to the list if inputs are valid", () => {
    addProvider();

    const listItems = document.querySelectorAll("#providerList li");
    expect(listItems.length).toBe(1);
    expect(listItems[0].innerHTML).toContain("Dr. Strange");
    expect(listItems[0].innerHTML).toContain("strange@example.com");
  });

  test("clears input fields after adding", () => {
    addProvider();

    expect(document.getElementById("providerName").value).toBe("");
    expect(document.getElementById("contact").value).toBe("");
  });

  test("shows alert if inputs are missing", () => {
    document.getElementById("providerName").value = "";
    document.getElementById("contact").value = "";

    addProvider();

    expect(global.alert).toHaveBeenCalledWith("Please fill out all fields.");
    expect(document.querySelectorAll("#providerList li").length).toBe(0);
  });
});
