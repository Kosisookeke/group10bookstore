const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    ISBN: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {
    timestamps: true
});


bookSchema.methods.getInfo = function() {
    return {
        id: this._id,
        title: this.title,
        author: this.author,
        price: this.price,
        ISBN: this.ISBN,
        stock: this.stock,
        genre: this.genre,
        seller: this.seller,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

bookSchema.methods.updateStock = async function(newStock) {
    if (newStock < 0) {
        throw new Error('Stock cannot be negative');
    }
    this.stock = newStock;
    return await this.save();
};

bookSchema.methods.updateBook = async function(bookData) {
    const { title, author, price, ISBN, genre, stock } = bookData;
    if (title) this.title = title;
    if (author) this.author = author;
    if (price !== undefined && price !== null) this.price = price;
    if (ISBN) this.ISBN = ISBN;
    if (genre) this.genre = genre;
    if (stock !== undefined && stock !== null) {
        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }
        this.stock = stock;
    }

    return await this.save();
}

// Class-level methods
bookSchema.statics.createStock = async function(bookData) {
    const book = new this(bookData);
    return await book.save();
};

bookSchema.statics.deleteStock = async function(bookId) {
    const result = await this.findByIdAndDelete(bookId);
    if (!result) {
        throw new Error('Book not found');
    }
    return result;
};

bookSchema.statics.getAllStock = async function(filters = {}) {
    return await this.find(filters)
        .populate('genre', 'name description')
        .populate('seller', 'name email')
        .sort({ createdAt: -1 });
};

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

// BookManager Class for handling book operations
class BookManager {
    constructor() {
        this.model = Book;
    }

    // Create a new book
    async createStock(bookData, userID) {
        try {
            bookData.seller = userID
            return await this.model.createStock(bookData);
        } catch (error) {
            throw new Error(`Failed to create book: ${error.message}`);
        }
    }

    // Get book information
    async getInfo(bookId) {
        try {
        const book = await this.model.findById(bookId)
            .populate('genre', 'name description')
            .populate('seller', 'username email');
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        return book.getInfo();
        } catch (error) {
        throw new Error(`Failed to get book info: ${error.message}`);
        }
    }

    // Update book stock
    async updateStock(bookId, newStock) {
        try {
        const book = await this.model.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        
        return await book.updateStock(newStock);
        } catch (error) {
        throw new Error(`Failed to update stock: ${error.message}`);
        }
    }

    // Update book details
    async updateBook(bookId, bookData) {
        try {
        const book = await this.model.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        
        return await book.updateBook(bookData);
        } catch (error) {
        throw new Error(`Failed to update book: ${error.message}`);
        }
    }

    // Delete a book
    async deleteStock(bookId) {
        try {
        return await this.model.deleteStock(bookId);
        } catch (error) {
        throw new Error(`Failed to delete book: ${error.message}`);
        }
    }

    // Get all books
    async getAllStock() {
        try {
        return await this.model.getAllStock();
        } catch (error) {
        throw new Error(`Failed to get books: ${error.message}`);
        }
    }
    }

// Export the model, class, and routes
module.exports = { Book, BookManager};
