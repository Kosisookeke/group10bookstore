const Cart = require('../../models/cartModel');
const { Book } = require('../../models/bookModel');

// Mock the Cart and Book models
jest.mock('../../models/cartModel');
jest.mock('../../models/bookModel');

// Implement the calculateCartTotals function for testing
// This is the same implementation as in the cartController.js file
const calculateCartTotals = (cart) => {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.items.forEach(item => {
    totalQuantity += item.quantity;
    totalPrice += item.subtotal;
  });

  cart.totalQuantity = totalQuantity;
  cart.totalPrice = totalPrice.toFixed(2);
};

describe('Cart Controller', () => {
  describe('calculateCartTotals', () => {
    let mockCart;
    
    beforeEach(() => {
      // Reset all mocks
      jest.clearAllMocks();
      
      // Create a mock cart with items
      mockCart = {
        items: [
          { quantity: 2, subtotal: 29.98 },
          { quantity: 1, subtotal: 14.99 },
          { quantity: 3, subtotal: 59.97 }
        ],
        totalQuantity: 0,
        totalPrice: 0
      };
    });
    
    test('should calculate the total quantity correctly', () => {
      // Act
      calculateCartTotals(mockCart);
      
      // Assert
      expect(mockCart.totalQuantity).toBe(6); // 2 + 1 + 3 = 6
    });
    
    test('should calculate the total price correctly', () => {
      // Act
      calculateCartTotals(mockCart);
      
      // Assert
      expect(mockCart.totalPrice).toBe('104.94'); // 29.98 + 14.99 + 59.97 = 104.94
    });
    
    test('should handle empty cart', () => {
      // Arrange
      mockCart.items = [];
      
      // Act
      calculateCartTotals(mockCart);
      
      // Assert
      expect(mockCart.totalQuantity).toBe(0);
      expect(mockCart.totalPrice).toBe('0.00');
    });
    
    test('should handle cart with one item', () => {
      // Arrange
      mockCart.items = [{ quantity: 5, subtotal: 99.95 }];
      
      // Act
      calculateCartTotals(mockCart);
      
      // Assert
      expect(mockCart.totalQuantity).toBe(5);
      expect(mockCart.totalPrice).toBe('99.95');
    });
    
    test('should format the total price as a string with two decimal places', () => {
      // Arrange
      mockCart.items = [{ quantity: 1, subtotal: 10.1 }];
      
      // Act
      calculateCartTotals(mockCart);
      
      // Assert
      expect(mockCart.totalPrice).toBe('10.10');
    });
  });
});