// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn()
  }));
  
  // Mock Firebase App initialization
  jest.mock('firebase/app', () => ({
    initializeApp: jest.fn()
  }));
  

  document.body.innerHTML = `
    <div id="reports-container"></div>
  `;
  
  // Import necessary methods/functions
  const { getDocs, collection } = require('firebase/firestore');
  const { initializeApp } = require('firebase/app');
  

  const { loadReports } = require('./view_reports.js');  
  
  describe('loadReports', () => {
    beforeEach(() => {
      // Reset mocks before each test
      getDocs.mockClear();
      collection.mockClear();
      initializeApp.mockClear();
    });
  
    // Testing
    test('displays reports correctly when data is available', async () => {
      // Mock Firestore data
      const mockSnapshot = {
        empty: false,
        forEach: jest.fn(callback => {
          callback({
            data: () => ({
              patient_name: 'John Doe',
              medication_taken: 'Advil',
              dosage: '10mg',
              time: '10:00 AM',
              day: '04/22/2025'
            })
          });
        })
      };
  
      // Mock Firestore function to return the mock data
      getDocs.mockResolvedValue(mockSnapshot);
      collection.mockReturnValue('mockedCollection');
  
      // Call the function
      await loadReports();
  
      // Check if the DOM was updated correctly
      const reportElement = document.querySelector('.report');
      expect(reportElement).not.toBeNull();
      expect(reportElement.querySelector('h3').textContent).toBe('John Doe');
      expect(reportElement.querySelector('p').textContent).toContain('Medication: Advil');
    });
  
    test('displays "No reports available" when no data is returned', async () => {
      // Mock Firestore to return no documents
      const mockSnapshot = { empty: true, forEach: jest.fn() };
      getDocs.mockResolvedValue(mockSnapshot);
      collection.mockReturnValue('mockedCollection');
  
      // Call the function
      await loadReports();
  
      // Check if updated correctly
      const container = document.getElementById('reports-container');
      expect(container.innerHTML).toContain('No reports available.');
    });
  
    test('displays error message when there is an error fetching data', async () => {
      // Mock Firestore to throw an error
      getDocs.mockRejectedValue(new Error('Firebase error'));
      collection.mockReturnValue('mockedCollection');
  
      // Call the function
      await loadReports();
  
      // Check if the DOM was updated with an error message
      const container = document.getElementById('reports-container');
      expect(container.innerHTML).toContain('Error loading reports.');
    });
  });
   
