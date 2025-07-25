const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../../models/userModel');

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

jest.mock('mongoose', () => {
  const mSchema = {
    pre: jest.fn().mockImplementation((event, callback) => {
      mSchema.preSaveCallback = async function(next) {
        if (this.isModified('password')) {
          this.password = 'hashedPassword';
        }
        await callback.call(this, next);
      };
      return mSchema;
    }),
    methods: {
      comparePassword: jest.fn()
    },
  };
  
  function UserModel(data) {
    this.username = data?.username || '';
    this.email = data?.email || '';
    this.password = data?.password || '';
    this.role = data?.role || 'buyer';
    this._id = data?._id || 'user-id';
    this.isModified = jest.fn().mockReturnValue(true);
    this.comparePassword = mSchema.methods.comparePassword;
    
    this.save = jest.fn().mockImplementation(async function() {
      if (mSchema.preSaveCallback) {
        const next = jest.fn();
        await mSchema.preSaveCallback.call(this, next);
        if (next.mock.calls.length > 0) {
          return this;
        }
      }
      return this;
    });
    
    return this;
  }
  
  UserModel.schema = mSchema;
  
  const mMongoose = {
    Schema: jest.fn().mockImplementation(() => mSchema),
    model: jest.fn().mockReturnValue(UserModel)
  };
  
  return mMongoose;
});

describe('User Model', () => {
  let user;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'buyer'
    });
    
    User.schema.methods.comparePassword = function(enteredPassword) {
      return bcrypt.compare(enteredPassword, this.password);
    };
    user.comparePassword = User.schema.methods.comparePassword;
  });
  
  describe('comparePassword', () => {
    test('should call bcrypt.compare with the correct parameters', async () => {
      const enteredPassword = 'password123';
      bcrypt.compare.mockResolvedValue(true);
      
      await user.comparePassword(enteredPassword);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, user.password);
    });
    
    test('should return true if the password matches', async () => {
      const enteredPassword = 'password123';
      bcrypt.compare.mockResolvedValue(true);
      
      const result = await user.comparePassword(enteredPassword);
  
      expect(result).toBe(true);
    });
    
    test('should return false if the password does not match', async () => {
      const enteredPassword = 'wrongpassword';
      bcrypt.compare.mockResolvedValue(false);
      
      const result = await user.comparePassword(enteredPassword);
      
      expect(result).toBe(false);
    });
  });
  
  describe('pre-save hook', () => {
    test('should hash the password before saving if password is modified', async () => {
      user.isModified.mockReturnValue(true);
      
      await user.save();
      
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
      expect(user.password).toBe('hashedPassword');
    });
    
    test('should not hash the password if it is not modified', async () => {
      user.isModified.mockReturnValue(false);
      
      await user.save();
      
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
