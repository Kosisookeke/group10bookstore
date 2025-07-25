const Cart = require('../../models/cartModel');
const { Book } = require('../../models/bookModel');

jest.mock('../../models/cartModel');
jest.mock('../../models/bookModel');

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
      jest.clearAllMocks();
      
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
      calculateCartTotals(mockCart);
      
      expect(mockCart.totalQuantity).toBe(6); 
    });
    
    test('should calculate the total price correctly', () => {
      calculateCartTotals(mockCart);
      
      expect(mockCart.totalPrice).toBe('104.94');
    });
    
    test('should handle empty cart', () => {
      mockCart.items = [];
      
      calculateCartTotals(mockCart);
      
      expect(mockCart.totalQuantity).toBe(0);
      expect(mockCart.totalPrice).toBe('0.00');
    });
    
    test('should handle cart with one item', () => {
      mockCart.items = [{ quantity: 5, subtotal: 99.95 }];
      
      calculateCartTotals(mockCart);
      
      expect(mockCart.totalQuantity).toBe(5);
      expect(mockCart.totalPrice).toBe('99.95');
    });
    
    test('should format the total price as a string with two decimal places', () => {
      mockCart.items = [{ quantity: 1, subtotal: 10.1 }];
      
      calculateCartTotals(mockCart);
      
      expect(mockCart.totalPrice).toBe('10.10');
    });
  });
});