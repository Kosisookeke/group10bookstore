const Category = require('../../models/categoryModel');
const categoryController = require('../../controllers/categoryController');

// Mock the Category model
jest.mock('../../models/categoryModel', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn()
}));

describe('Category Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      body: {
        name: 'Test Category',
        description: 'This is a test category'
      },
      query: {
        id: 'test-category-id'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('createCategory', () => {
    test('should call Category.create with the request body', async () => {
      // Arrange
      const mockCategory = {
        _id: 'test-category-id',
        name: 'Test Category',
        description: 'This is a test category'
      };
      Category.create.mockResolvedValue(mockCategory);
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(Category.create).toHaveBeenCalledWith(req.body);
    });
    
    test('should return 201 status code and success message on successful creation', async () => {
      // Arrange
      const mockCategory = {
        _id: 'test-category-id',
        name: 'Test Category',
        description: 'This is a test category'
      };
      Category.create.mockResolvedValue(mockCategory);
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Category created successfully',
        category: mockCategory
      });
    });
    
    test('should return 400 status code and error message if creation fails', async () => {
      // Arrange
      const errorMessage = 'Validation error';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
    
    test('should handle missing required fields', async () => {
      // Arrange
      req.body = {}; // Empty body
      const errorMessage = 'Name is required';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
    
    test('should handle duplicate category names', async () => {
      // Arrange
      const errorMessage = 'Duplicate key error';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
  });
});