jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => 'mockedFirestore'),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),  // Mock getDocs
  addDoc: jest.fn()    // Mock addDoc
}));

// Import necessary methods/functions
const { registerPatient, calculateDOB } = require('./register'); // Adjust the import as necessary
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, query, where } = require('firebase/firestore');

describe("registerPatient", () => {
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
    // Mocking Firestore behavior for getDocs to simulate username taken
    getDocs.mockResolvedValue({ empty: false });
    console.log("Mocking getDocs response for taken username");

    await registerPatient(mockEvent, mockDocument);
    
    expect(mockDocument.getElementById("error-message").innerText).toBe("Username already taken.");
    expect(alertMock).not.toHaveBeenCalled();
  });

  test('registers patient successfully', async () => {
    // Mocking Firestore behavior for getDocs to simulate a new username
    getDocs.mockResolvedValue({ empty: true });
    addDoc.mockResolvedValue({});
    console.log("Mocking successful registration");

    await registerPatient(mockEvent, mockDocument);
    
    expect(addDoc).toHaveBeenCalledTimes(1); // One for users, one for auth
    expect(alertMock).toHaveBeenCalledWith("Registration successful!");
    expect(window.location.href).toBe("login.html");
  });

  test('displays error message on failure', async () => {
    // Mocking Firestore to simulate failure with addDoc
    const errorMessage = "Firestore failure";
    addDoc.mockRejectedValue(new Error(errorMessage));
    console.log("Mocking Firestore failure");

    await registerPatient(mockEvent, mockDocument);
    
    expect(mockDocument.getElementById("error-message").innerText).toBe(`Error: ${errorMessage}`);
  });
});

describe("calculateDOB", () => {
  test("returns correct DOB string", () => {
    const dob = calculateDOB(30);
    const expectedYear = new Date().getFullYear() - 30;
    expect(dob).toMatch(new RegExp(`^${expectedYear}-\\d{2}-\\d{2}$`));
  });
});
