// Mock the Client class
class MockClient {
    query = jest.fn().mockResolvedValue({ rows: [] }); // Mock the query method
    release = jest.fn(); // Mock the release method
}
  
// Mock the Pool class
class MockPool {
    connect = jest.fn().mockResolvedValue(new MockClient()); // Return a mock client
    end = jest.fn().mockResolvedValue(undefined); // Mock the end method
}
  
// Export the mock Pool and Client
module.exports = {
    Pool: MockPool,
    Client: MockClient,
};