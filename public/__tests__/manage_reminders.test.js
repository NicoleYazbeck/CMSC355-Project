/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Import your Firebase mocks
import { getDocs, addDoc } from "firebase/firestore";

// Import the HTML content directly or simulate it
beforeEach(() => {
  document.body.innerHTML = `
    <div class="main">
      <input type="number" id="patientId" placeholder="e.g., 1001" />
      <button id="loadRemindersBtn">Load Reminders</button>
      <div id="reminderForm">
        <input type="text" id="medication">
        <input type="text" id="dosage">
        <input type="time" id="reminderTime">
        <button id="addReminderBtn">Add Reminder</button>
      </div>
      <ul id="reminderList"></ul>
    </div>
  `;
  
  // Manually rebind the event listeners because your real script would normally do that on load
  require("./manage_reminders.js");
});

// Mock Firebase calls globally
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn()
}));

describe("Manage Reminders", () => {
  
  it("shows 'No reminders found' if no reminders exist for patient", async () => {
    getDocs.mockResolvedValueOnce({ empty: true, forEach: jest.fn() });

    const loadBtn = screen.getByText("Load Reminders");
    const patientIdInput = screen.getByPlaceholderText("e.g., 1001");

    await userEvent.type(patientIdInput, "1234");
    await userEvent.click(loadBtn);

    const reminderList = await screen.findByRole("list");
    expect(reminderList).toHaveTextContent("No reminders found.");
  });

  it("alerts when patient ID input is empty", async () => {
    window.alert = jest.fn(); // Mock window.alert

    const loadBtn = screen.getByText("Load Reminders");

    await userEvent.click(loadBtn);

    expect(window.alert).toHaveBeenCalledWith("Please enter a patient ID.");
  });

  it("alerts if medication is missing when adding reminder", async () => {
    window.alert = jest.fn();

    const addBtn = screen.getByText("Add Reminder");
    const dosageInput = screen.getByLabelText("Dosage:");
    const timeInput = screen.getByLabelText("Reminder Time:");

    await userEvent.type(dosageInput, "500mg");
    await userEvent.type(timeInput, "08:00");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it("alerts if dosage is missing when adding reminder", async () => {
    window.alert = jest.fn();

    const addBtn = screen.getByText("Add Reminder");
    const medInput = screen.getByLabelText("Medication Name:");
    const timeInput = screen.getByLabelText("Reminder Time:");

    await userEvent.type(medInput, "Ibuprofen");
    await userEvent.type(timeInput, "08:00");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it("alerts if reminder time is missing when adding reminder", async () => {
    window.alert = jest.fn();

    const addBtn = screen.getByText("Add Reminder");
    const medInput = screen.getByLabelText("Medication Name:");
    const dosageInput = screen.getByLabelText("Dosage:");

    await userEvent.type(medInput, "Ibuprofen");
    await userEvent.type(dosageInput, "500mg");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it("adds a reminder successfully if all fields are filled", async () => {
    window.alert = jest.fn();
    addDoc.mockResolvedValueOnce({});

    const addBtn = screen.getByText("Add Reminder");
    const medInput = screen.getByLabelText("Medication Name:");
    const dosageInput = screen.getByLabelText("Dosage:");
    const timeInput = screen.getByLabelText("Reminder Time:");

    await userEvent.type(medInput, "Ibuprofen");
    await userEvent.type(dosageInput, "500mg");
    await userEvent.type(timeInput, "08:00");
    await userEvent.click(addBtn);

    expect(addDoc).toHaveBeenCalled();
  });

});
