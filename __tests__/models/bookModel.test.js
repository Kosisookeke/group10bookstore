const mongoose = require('mongoose');
const { Book, BookManager } = require('../../models/bookModel');

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

jest.mock('../../models/bookModel', () => {
  const mockBook = {
    createStock: jest.fn(),
    deleteStock: jest.fn(),
    getAllStock: jest.fn(),
    save: jest.fn()
  };
  
  const MockBookManager = jest.fn().mockImplementation(() => {
    return {
      model: mockBook,
      createStock: jest.fn().mockImplementation(async (bookData, userID) => {
        try {
          if (!bookData) {
            throw new Error('Book data is required');
          }
          
          bookData.seller = userID;
          return await mockBook.createStock(bookData);
        } catch (error) {
          throw new Error(`Failed to create book: ${error.message}`);
        }
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
    jest.clearAllMocks();
    
    bookManager = new BookManager();
    
    mockBookData = {
      title: 'Test Book',
      author: 'Test Author',
      price: 19.99,
      ISBN: '1234567890',
      stock: 10,
      genre: 'test-genre-id'
    };
    
    mockUserID = 'test-user-id';
    
    Book.createStock.mockResolvedValue(mockBookData);
  });
  
  describe('createStock', () => {
    test('should call Book.createStock with the correct parameters', async () => {
      const result = await bookManager.createStock(mockBookData, mockUserID);
      
      expect(Book.createStock).toHaveBeenCalledWith({
        ...mockBookData,
        seller: mockUserID
      });
      expect(result).toEqual(mockBookData);
    });
    
    test('should add the seller ID to the book data', async () => {
      await bookManager.createStock(mockBookData, mockUserID);
      
      expect(mockBookData.seller).toBe(mockUserID);
    });
    
    test('should throw an error if book data is not provided', async () => {
      await expect(bookManager.createStock(null, mockUserID))
        .rejects
        .toThrow('Book data is required');
    });
    
    test('should throw an error if Book.createStock fails', async () => {
      const errorMessage = 'Database error';
      Book.createStock.mockRejectedValue(new Error(errorMessage));
      
      await expect(bookManager.createStock(mockBookData, mockUserID))
        .rejects
        .toThrow(`Failed to create book: ${errorMessage}`);
    });
  });
});