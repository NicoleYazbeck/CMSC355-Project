// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => 'mockedFirestore'),
  collection: jest.fn(),
  addDoc: jest.fn()
}));

// Import necessary methods/functions
const { submitMedication } = require('./submit_adherence');
const { addDoc } = require('firebase/firestore');

// Testing
describe('submitMedication', () => {
  test('calls addDoc with correct data', async () => {
    const formData = {
      patientName: 'John',
      medication: 'Advil',
      dosage: '10mg',
      timeInput: '2025-04-22T10:00'
    };

    await submitMedication(formData);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      patient_name: 'John',
      medication_taken: 'Advil',
      dosage: '10mg',
      time: expect.any(String),
      day: expect.any(String)
    });
  });
});