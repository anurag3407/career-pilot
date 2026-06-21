const request = require('supertest');
const app = require('../../app'); // Adjust this to point to your Express app entry file
const { authMiddleware } = require('../../middleware/auth'); // Adjust path
const Interview = require('../../models/Interview'); // Adjust path to your DB model/controller

// Mock the authentication middleware to control the user state
jest.mock('../../middleware/auth', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { uid: 'user-123' }; // Default mock user
    next();
  }),
}));

// Mock the database layer
jest.mock('../../models/Interview');

describe('DELETE /api/interview/:id', () => {
  const mockInterviewId = 'interview-abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the interview successfully (200)', async () => {
    // Mock finding the interview and verifying ownership
    Interview.findById.mockResolvedValue({
      _id: mockInterviewId,
      userId: 'user-123',
    });
    // Mock the actual deletion
    Interview.findByIdAndDelete.mockResolvedValue(true);

    const response = await request(app)
      .delete(`/api/interview/${mockInterviewId}`)
      .set('Authorization', 'Bearer mock-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Interview deleted successfully' });
    expect(Interview.findByIdAndDelete).toHaveBeenCalledWith(mockInterviewId);
  });

  it('should return 404 if the interview does not exist', async () => {
    Interview.findById.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/interview/non-existent-id`)
      .set('Authorization', 'Bearer mock-token');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 403 if the user does not own the interview', async () => {
    // Interview belongs to a different user
    Interview.findById.mockResolvedValue({
      _id: mockInterviewId,
      userId: 'different-user-456',
    });

    const response = await request(app)
      .delete(`/api/interview/${mockInterviewId}`)
      .set('Authorization', 'Bearer mock-token');

    expect(response.status).toBe(403);
    expect(Interview.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is unauthenticated', async () => {
    // Override the mock to simulate a missing/invalid token
    authMiddleware.mockImplementationOnce((req, res) => {
      return res.status(401).json({ error: 'Not authenticated' });
    });

    const response = await request(app).delete(`/api/interview/${mockInterviewId}`);

    expect(response.status).toBe(401);
  });
});
