// Mock Firestore methods before importing the tested file
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => 'mockedFirestore'),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn()
}));

// Import necessary methods/functions after mocking
const { login } = require('./login.js'); // Adjust the import path as necessary
const { getFirestore, collection, getDocs, addDoc, query, where } = require('firebase/firestore');



describe("loginUser", () => {
  it("calls Firestore with correct username and password", async () => {
    // Mock getDocs to return a fake empty querySnapshot
    getDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ role: "patient" }) }]
    });

    document.body.innerHTML = `
      <form id="login-form">
        <input type="text" id="login-username" />
        <input type="password" id="login-password" />
        <button id="login-button">Login</button>
        <div id="error-message"></div>
      </form>
    `;

    document.getElementById('login-username').value = 'testuser';
    document.getElementById('login-password').value = 'testpass';

    const fakeEvent = { preventDefault: jest.fn() };
    await login(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
  });
});
