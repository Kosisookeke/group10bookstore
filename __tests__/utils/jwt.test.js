const jwt = require('jsonwebtoken');
const { signToken, verifyToken } = require('../../utils/jwt');

jest.mock('jsonwebtoken');

describe('JWT Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  describe('signToken', () => {
    test('should call jwt.sign with correct parameters', () => {
      const userId = '123456789';
      const expectedPayload = { id: userId };
      const expectedSecret = 'test-secret';
      const expectedOptions = { expiresIn: '1h' };
      
      jwt.sign.mockReturnValue('test-token');
      
      const token = signToken(userId);
      
      expect(jwt.sign).toHaveBeenCalledWith(expectedPayload, expectedSecret, expectedOptions);
      expect(token).toBe('test-token');
    });

    test('should throw an error if userId is not provided', () => {
      expect(() => signToken()).toThrow();
    });
  });

  describe('verifyToken', () => {
    test('should call jwt.verify with correct parameters', () => {

      const token = 'test-token';
      const expectedSecret = 'test-secret';
      const decodedToken = { id: '123456789' };
      
      jwt.verify.mockReturnValue(decodedToken);
      
      const result = verifyToken(token);
      
      expect(jwt.verify).toHaveBeenCalledWith(token, expectedSecret);
      expect(result).toEqual(decodedToken);
    });

    test('should throw an error if token is invalid', () => {
      const token = 'invalid-token';
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      expect(() => verifyToken(token)).toThrow('Invalid token');
    });
  });
});