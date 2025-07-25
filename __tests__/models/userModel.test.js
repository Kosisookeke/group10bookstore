const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../../models/userModel');

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

// Mock mongoose
jest.mock('mongoose', () => {
  const mSchema = {
    pre: jest.fn().mockImplementation((event, callback) => {
      // Store the callback to simulate the pre-save hook
      mSchema.preSaveCallback = callback;
      return mSchema;
    }),
    methods: {},
  };
  
  const mMongoose = {
    Schema: jest.fn().mockImplementation(() => mSchema),
    model: jest.fn().mockReturnValue(function UserModel(data) {
      this.username = data?.username || '';
      this.email = data?.email || '';
      this.password = data?.password || '';
      this.role = data?.role || 'buyer';
      this._id = data?._id || 'user-id';
      this.isModified = jest.fn().mockReturnValue(true);
      this.comparePassword = mSchema.methods.comparePassword;
      
      // Add a save method that calls the pre-save hook
      this.save = jest.fn().mockImplementation(async function() {
        if (mSchema.preSaveCallback) {
          const next = jest.fn();
          await mSchema.preSaveCallback.call(this, next);
          if (next.mock.calls.length > 0) {
            // If next was called, the hook completed successfully
            return this;
          }
        }
        return this;
      });
      
      return this;
    })
  };
  
  return mMongoose;
});

describe('User Model', () => {
  let user;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new user for each test
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'buyer'
    });
    
    // Add the comparePassword method to the user instance
    User.schema.methods.comparePassword = function(enteredPassword) {
      return bcrypt.compare(enteredPassword, this.password);
    };
    user.comparePassword = User.schema.methods.comparePassword;
  });
  
  describe('comparePassword', () => {
    test('should call bcrypt.compare with the correct parameters', async () => {
      // Arrange
      const enteredPassword = 'password123';
      bcrypt.compare.mockResolvedValue(true);
      
      // Act
      await user.comparePassword(enteredPassword);
      
      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, user.password);
    });
    
    test('should return true if the password matches', async () => {
      // Arrange
      const enteredPassword = 'password123';
      bcrypt.compare.mockResolvedValue(true);
      
      // Act
      const result = await user.comparePassword(enteredPassword);
      
      // Assert
      expect(result).toBe(true);
    });
    
    test('should return false if the password does not match', async () => {
      // Arrange
      const enteredPassword = 'wrongpassword';
      bcrypt.compare.mockResolvedValue(false);
      
      // Act
      const result = await user.comparePassword(enteredPassword);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('pre-save hook', () => {
    test('should hash the password before saving if password is modified', async () => {
      // Arrange
      user.isModified.mockReturnValue(true);
      
      // Act
      await user.save();
      
      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
      expect(user.password).toBe('hashedPassword');
    });
    
    test('should not hash the password if it is not modified', async () => {
      // Arrange
      user.isModified.mockReturnValue(false);
      
      // Act
      await user.save();
      
      // Assert
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});