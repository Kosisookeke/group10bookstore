const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { seller } = require('../middlewares/seller');
const categoryController = require('../controllers/categoryController');



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
router.get('/categories', protect, seller, categoryController.getAllCategories);

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
router.get('/categories/:id', protect, seller, categoryController.getCategoryById);

module.exports = router;