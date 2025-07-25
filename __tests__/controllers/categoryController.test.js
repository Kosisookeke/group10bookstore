const Category = require('../../models/categoryModel');
const categoryController = require('../../controllers/categoryController');

jest.mock('../../models/categoryModel', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn()
}));

describe('Category Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
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
      const mockCategory = {
        _id: 'test-category-id',
        name: 'Test Category',
        description: 'This is a test category'
      };
      Category.create.mockResolvedValue(mockCategory);
      
      await categoryController.createCategory(req, res);
      
      expect(Category.create).toHaveBeenCalledWith(req.body);
    });
    
    test('should return 201 status code and success message on successful creation', async () => {
      const mockCategory = {
        _id: 'test-category-id',
        name: 'Test Category',
        description: 'This is a test category'
      };
      Category.create.mockResolvedValue(mockCategory);
      
      await categoryController.createCategory(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Category created successfully',
        category: mockCategory
      });
    });
    
    test('should return 400 status code and error message if creation fails', async () => {
      const errorMessage = 'Validation error';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      await categoryController.createCategory(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
    
    test('should handle missing required fields', async () => {
      req.body = {}; 
      const errorMessage = 'Name is required';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      await categoryController.createCategory(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
    
    test('should handle duplicate category names', async () => {
      const errorMessage = 'Duplicate key error';
      Category.create.mockRejectedValue(new Error(errorMessage));
      
      await categoryController.createCategory(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create category',
        error: errorMessage
      });
    });
  });
});