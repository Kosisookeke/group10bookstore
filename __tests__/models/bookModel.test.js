const mongoose = require('mongoose');
const { Book, BookManager } = require('../../models/bookModel');

// Mock the mongoose model and methods
jest.mock('mongoose', () => {
  const mModel = {
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis()
  };
  
  const mMongoose = {
    Schema: jest.fn(),
    model: jest.fn().mockReturnValue(mModel)
  };
  
  return mMongoose;
});

// Mock the Book model's static methods
jest.mock('../../models/bookModel', () => {
  // Create a mock implementation of the Book model
  const mockBook = {
    createStock: jest.fn(),
    deleteStock: jest.fn(),
    getAllStock: jest.fn(),
    save: jest.fn()
  };
  
  // Create a mock implementation of the BookManager class
  const MockBookManager = jest.fn().mockImplementation(() => {
    return {
      model: mockBook,
      createStock: jest.fn().mockImplementation(async (bookData, userID) => {
        if (!bookData) {
          throw new Error('Book data is required');
        }
        
        bookData.seller = userID;
        return mockBook.createStock(bookData);
      }),
      getInfo: jest.fn(),
      updateStock: jest.fn(),
      updateBook: jest.fn(),
      deleteStock: jest.fn(),
      getAllStock: jest.fn()
    };
  });
  
  return {
    Book: mockBook,
    BookManager: MockBookManager
  };
});

describe('BookManager', () => {
  let bookManager;
  let mockBookData;
  let mockUserID;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new instance of BookManager for each test
    bookManager = new BookManager();
    
    // Create mock book data
    mockBookData = {
      title: 'Test Book',
      author: 'Test Author',
      price: 19.99,
      ISBN: '1234567890',
      stock: 10,
      genre: 'test-genre-id'
    };
    
    // Create mock user ID
    mockUserID = 'test-user-id';
    
    // Mock the Book.createStock method to return the book data
    Book.createStock.mockResolvedValue(mockBookData);
  });
  
  describe('createStock', () => {
    test('should call Book.createStock with the correct parameters', async () => {
      // Act
      const result = await bookManager.createStock(mockBookData, mockUserID);
      
      // Assert
      expect(Book.createStock).toHaveBeenCalledWith({
        ...mockBookData,
        seller: mockUserID
      });
      expect(result).toEqual(mockBookData);
    });
    
    test('should add the seller ID to the book data', async () => {
      // Act
      await bookManager.createStock(mockBookData, mockUserID);
      
      // Assert
      expect(mockBookData.seller).toBe(mockUserID);
    });
    
    test('should throw an error if book data is not provided', async () => {
      // Act & Assert
      await expect(bookManager.createStock(null, mockUserID))
        .rejects
        .toThrow('Book data is required');
    });
    
    test('should throw an error if Book.createStock fails', async () => {
      // Arrange
      const errorMessage = 'Database error';
      Book.createStock.mockRejectedValue(new Error(errorMessage));
      
      // Act & Assert
      await expect(bookManager.createStock(mockBookData, mockUserID))
        .rejects
        .toThrow(`Failed to create book: ${errorMessage}`);
    });
  });
});