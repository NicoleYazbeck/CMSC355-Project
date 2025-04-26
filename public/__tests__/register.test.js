/**
 * @jest-environment jsdom
 */

import { registerPatient, calculateDOB, db } from "../Sprint 2/register.js";

// Mock db.collection manually
jest.mock("../Sprint 2/register.js", () => {
  const originalModule = jest.requireActual("../Sprint 2/register.js");
  return {
    ...originalModule,
    db: {
      collection: jest.fn()
    }
  };
});

describe('registerPatient', () => {
  let mockEvent;
  let mockDocument;
  let alertMock;
  let locationMock;

  beforeEach(() => {
    mockEvent = { preventDefault: jest.fn() };

    document.body.innerHTML = `
      <input id="name" value="John Doe"/>
      <input id="email" value="john@example.com"/>
      <input id="age" value="25"/>
      <input id="patient_id" value="123"/>
      <input id="username" value="johndoe"/>
      <input id="password" value="securepass"/>
      <p id="error-message"></p>
    `;

    mockDocument = document;

    alertMock = jest.fn();
    global.alert = alertMock;

    locationMock = { href: '' };
    delete window.location;
    window.location = locationMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows error if username is already taken', async () => {
    const getMock = jest.fn().mockResolvedValue({ empty: false });
    db.collection.mockReturnValue({ where: () => ({ get: getMock }) });

    await registerPatient(mockEvent, mockDocument);

    expect(mockDocument.getElementById("error-message").innerText).toBe("Username already taken.");
    expect(alertMock).not.toHaveBeenCalled();
  });

  test('registers patient successfully', async () => {
    const getMock = jest.fn().mockResolvedValue({ empty: true });
    const addMock = jest.fn().mockResolvedValue({});

    db.collection.mockImplementation((name) => ({
      where: () => ({ get: getMock }),
      add: addMock
    }));

    await registerPatient(mockEvent, mockDocument);

    expect(addMock).toHaveBeenCalledTimes(2); // One for users, one for auth
    expect(alertMock).toHaveBeenCalledWith("Registration successful!");
    expect(window.location.href).toBe("login.html");
  });

  test('displays error message on failure', async () => {
    const failingAdd = jest.fn().mockRejectedValue(new Error("Firestore failure"));
    db.collection.mockImplementation((name) => ({
      where: () => ({ get: jest.fn().mockResolvedValue({ empty: true }) }),
      add: failingAdd
    }));

    await registerPatient(mockEvent, mockDocument);

    expect(mockDocument.getElementById("error-message").innerText).toBe("Error: Firestore failure");
  });
});

describe("calculateDOB", () => {
  test("returns correct DOB string", () => {
    const dob = calculateDOB(30);
    const expectedYear = new Date().getFullYear() - 30;
    expect(dob).toMatch(new RegExp(`^${expectedYear}-\\d{2}-\\d{2}$`));
  });
});

