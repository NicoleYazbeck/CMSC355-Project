/**
 * @jest-environment jsdom
 */

const { registerPatient, calculateDOB, db } = require('../Sprint 2/register.js');


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

    db.collection.mockImplementation((name) => {
      return {
        where: () => ({ get: getMock }),
        add: addMock
      };
    });

    await registerPatient(mockEvent, mockDocument);

    expect(addMock).toHaveBeenCalledTimes(2); // users and auth collections
    expect(alertMock).toHaveBeenCalledWith("Registration successful!");
    expect(window.location.href).toBe("login.html");
  });

  test('displays error message on failure', async () => {
    db.collection.mockImplementation(() => ({
      where: () => ({ get: jest.fn().mockResolvedValue({ empty: true }) }),
      add: jest.fn().mockRejectedValue(new Error("Firestore failure"))
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
