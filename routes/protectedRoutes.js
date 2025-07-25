const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { seller } = require('../middlewares/seller');
const categoryController = require('../controllers/categoryController');
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');



router.get('/dashboard', protect, (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected dashboard!', user: req.user });
});

//--------------------CATEGORY ROUTES-------------------

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories. Requires seller authentication.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *             example:
 *               categories:
 *                 - _id: "64bd..."
 *                   name: "Electronics"
 *                   description: "All electronic items and gadgets"
 *                 - _id: "64bd..."
 *                   name: "Clothing"
 *                   description: "Fashion and apparel items"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Seller role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Failed to retrieve categories"
 *               error: "Database connection failed"
 */
router.get('/categories', categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category. Requires seller authentication.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['name']
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Electronics"
 *             description: "All electronic items and gadgets"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *             example:
 *               message: "Category created successfully"
 *               category:
 *                 _id: "64bd..."
 *                 name: "Electronics"
 *                 description: "All electronic items and gadgets"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Failed to create category"
 *               error: "Category name is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Seller role required"
 */
router.post('/categories', protect, seller, categoryController.createCategory);

/**
 * @swagger
 * /api/categories:
 *   put:
 *     summary: Update an existing category
 *     description: Update a category by providing the category ID as a query parameter. Requires seller authentication.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The MongoDB ObjectId of the category to update
 *         schema:
 *           type: string
 *           example: "64bd..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Updated Electronics"
 *             description: "Updated description for electronics category"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *             example:
 *               message: "Category updated successfully"
 *               category:
 *                 _id: "64bd..."
 *                 name: "Updated Electronics"
 *                 description: "Updated description for electronics category"
 *       400:
 *         description: Bad request - Category not found or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Category not found"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Seller role required"
 */
router.put('/categories', protect, seller, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category by providing the category ID as a query parameter. Requires seller authentication.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The MongoDB ObjectId of the category to delete
 *         schema:
 *           type: string
 *           example: "64bd..."
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Category deleted successfully"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Category not found"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Seller role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Internal Server Error"
 */
router.delete('/categories', protect, seller, categoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Retrieve a single category by its ID. Requires seller authentication.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The MongoDB ObjectId of the category to retrieve
 *         schema:
 *           type: string
 *           example: "64bd..."
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *             example:
 *               category:
 *                 _id: "64bd..."
 *                 name: "Electronics"
 *                 description: "All electronic items and gadgets"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Category not found"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not a seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Seller role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Internal Server Error"
 */
router.get('/categories/:id', categoryController.getCategoryById);

//--------------------BOOK ROUTES-------------------

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (SellerID is added in the backend)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Book created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input or creation failed
 */
router.post('/books', protect, seller, bookController.createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */
router.get('/books', bookController.getAllBooks);

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/book', bookController.getBookByID);

/**
 * @swagger
 * /books:
 *   put:
 *     summary: Update book information
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Updated Book Title
 *               author: New Author
 *               price: 15.99
 *               ISBN: 978-1234567890
 *               genre: 64bd...
 *               stock: 120
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Book updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input or update failed
 */
router.put('/books', protect, seller, bookController.updateBook);

/**
 * @swagger
 * /books/stock:
 *   put:
 *     summary: Update book stock
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book whose stock is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Stock updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing or invalid stock value
 */
router.put('/books/stock', protect, seller, bookController.updateStock);

/**
 * @swagger
 * /books:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete('/books', protect, seller, bookController.deleteBook);

//--------------------CART ROUTES-------------------

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.get('/cart', protect, cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a book to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or failed to add item
 *       401:
 *         description: Unauthorized
 */
router.post('/cart', protect, cartController.addToCart);

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update item quantity in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input or update failed
 *       401:
 *         description: Unauthorized
 */
router.put('/cart', protect, cartController.updateCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Invalid product ID or deletion failed
 *       401:
 *         description: Unauthorized
 */
router.delete('/cart', protect, cartController.removeCartItem);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout the cart and calculate total
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart checked out and cleared
 *                 totalAmount:
 *                   type: number
 *                   example: 199.99
 *       400:
 *         description: Checkout failed due to invalid cart
 *       401:
 *         description: Unauthorized
 */
router.post('/cart/checkout', protect, cartController.checkoutCart);


module.exports = router;