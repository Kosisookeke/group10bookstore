const Cart = require('../models/Cart');
const Book = require('../models/Book');

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

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.user.id }).populate('items.book');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid book or quantity' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    let cart = await Cart.findById(req.user.id);
    if (!cart) {
      cart = new Cart({ _id: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.book.equals(bookId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].quantity * book.price;
    } else {
      cart.items.push({
        book: bookId,
        quantity,
        subtotal: book.price * quantity
      });
    }

    calculateCartTotals(cart);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || quantity < 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const cart = await Cart.findById(req.user.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.book.equals(bookId));
    if (itemIndex === -1) return res.status(404).json({ message: 'Book not in cart' });

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const book = await Book.findById(bookId);
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = book.price * quantity;
    }

    calculateCartTotals(cart);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { bookId } = req.params;

  try {
    const cart = await Cart.findById(req.user.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.book.equals(bookId));

    calculateCartTotals(cart);
    await cart.save();

    res.status(200).json({ message: 'Book removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.user.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.totalPrice = 0;
    cart.totalQuantity = 0;
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.book');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or not found.' });
    }

    cart.items.forEach(item => {
      item.subtotal = item.book.price * item.quantity;
    });

    calculateCartTotals(cart);

    const checkoutSummary = {
      message: 'Checkout successful.',
      totalAmount: cart.totalPrice,
      currency: 'USD',
      totalItems: cart.totalQuantity,
      items: cart.items.map(item => ({
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
        subtotal: item.subtotal.toFixed(2),
      })),
    };

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json(checkoutSummary);
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Server error during checkout.' });
  }
};
