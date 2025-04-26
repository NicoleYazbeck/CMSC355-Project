/**
 * @jest-environment jsdom
 */

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn()
}));

// Mock window.alert globally
jest.spyOn(window, 'alert').mockImplementation(() => {});

require('@testing-library/jest-dom');
const { fireEvent, screen } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;

// Import Firebase mocks
const { getDocs, addDoc } = require('firebase/firestore');

// Setup DOM before each test
beforeEach(() => {
  document.body.innerHTML = `
    <input id="patientId" placeholder="e.g., 1001" type="number" />
    <button id="loadRemindersBtn">Load Reminders</button>

    <div id="reminderForm">
      <label for="medication">Medication Name:</label>
      <input id="medication" type="text" />

      <label for="dosage">Dosage:</label>
      <input id="dosage" type="text" />

      <label for="reminderTime">Reminder Time:</label>
      <input id="reminderTime" type="time" />

      <button id="addReminderBtn">Add Reminder</button>
    </div>

    <ul id="reminderList"></ul>
  `;

  jest.resetModules(); // Reset require cache
  require('./manage_reminders.js'); // Re-require after setting up DOM
});

describe("Manage Reminders", () => {

  it("alerts when patient ID input is empty", async () => {
    const loadBtn = screen.getByText("Load Reminders");

    await userEvent.click(loadBtn);

    expect(window.alert).toHaveBeenCalledWith("Please enter a patient ID.");
  });

  it("alerts if medication is missing when adding reminder", async () => {
    const addBtn = screen.getByText("Add Reminder");
    const dosageInput = screen.getByLabelText("Dosage:");
    const timeInput = screen.getByLabelText("Reminder Time:");

    await userEvent.type(dosageInput, "500mg");
    await userEvent.type(timeInput, "08:00");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it("alerts if dosage is missing when adding reminder", async () => {
    const addBtn = screen.getByText("Add Reminder");
    const medInput = screen.getByLabelText("Medication Name:");
    const timeInput = screen.getByLabelText("Reminder Time:");

    await userEvent.type(medInput, "Ibuprofen");
    await userEvent.type(timeInput, "08:00");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });

  it("alerts if reminder time is missing when adding reminder", async () => {
    const addBtn = screen.getByText("Add Reminder");
    const medInput = screen.getByLabelText("Medication Name:");
    const dosageInput = screen.getByLabelText("Dosage:");

    await userEvent.type(medInput, "Ibuprofen");
    await userEvent.type(dosageInput, "500mg");
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
  });


});
