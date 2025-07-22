const {Book, BookManager} = require('../models/bookModel');
const bookManager = new BookManager();


exports.getAllBooks = async (req, res) => {
try {
    const books = await bookManager.getAllStock();
    res.status(200).json({ success: true, data: books, count: books.length });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};

exports.getBookByID = async (req, res) => {
try {
    const book = await bookManager.getInfo(req.query.id);
    res.status(200).json({ success: true, data: book});
} catch (error) {
    res.status(404).json({ success: false, message: error.message });
}
};

exports.createBook = async (req, res) => {
    try {
        const book = await bookManager.createStock(req.body, req.user._id);
        res.status(201).json({ success: true, data: book, message: 'Book created successfully'});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined || stock === null) {
        return res.status(400).json({ success: false, message: 'Stock value is required' });
        }
        
        const book = await bookManager.updateStock(req.query.id, stock);
        res.status(200).json({ success: true, data: book, message: 'Stock updated successfully'});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const bookData = req.body;
        const book = await bookManager.updateBook(req.query.id, bookData);
        res.status(200).json({ success: true, data: book, message: 'Book updated successfully'});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await bookManager.deleteStock(req.query.id);
        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};