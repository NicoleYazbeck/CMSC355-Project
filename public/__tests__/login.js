// Mock Firebase Authentication methods
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn()
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

// Setup DOM
document.body.innerHTML = `
  <form id="login-form">
    <input id="login-email" />
    <input id="login-password" />
    <button type="submit">Login</button>
  </form>
`;

const { signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');

const { loginUser } = require('./login.js'); // Your login function

describe('loginUser', () => {
  beforeEach(() => {
    signInWithEmailAndPassword.mockClear();
    initializeApp.mockClear();
  });

  test('logs in an existing user successfully', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '12345' } });

    // Trigger login function
    await loginUser('test@example.com', 'TestPassword123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'TestPassword123'
    );
  });

  test('handles login errors gracefully', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Login failed'));

    // Trigger login function
    await loginUser('test@example.com', 'TestPassword123');

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });
});
