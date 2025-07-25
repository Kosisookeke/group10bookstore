const User = require('../models/userModel');
const Category = require('../models/categoryModel');

/**
 * Create a new category
 * 
 * @route POST /categories
 * @access Sellers
 * 
 * Expected JSON input:
 * {
 *   "name": "Electronics",
 *   "description": "All electronic items and gadgets"
 * }
 * 
 * Example URL: POST http://localhost:3000/api/categories
 */
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create category', error: err.message });
    }
};

/**
 * Get all categories
 * 
 * @route GET /categories
 * @access Sellers
 * 
 * No JSON input required
 * 
 * Example URL: GET http://localhost:3000/api/categories
 */
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve categories', error: err.message });
    }
};

/**
 * Update an existing category
 * 
 * @route PUT /categories?id=categoryId
 * @access Sellers
 * 
 * Expected JSON input (all fields optional):
 * {
 *   "name": "Updated Electronics",
 *   "description": "Updated description for electronics category"
 * }
 * 
 * Example URL: PUT http://localhost:3000/api/categories?id=507f1f77bcf86cd799439011
 */
exports.updateCategory = async (req, res) => {
    try{
        // Find category by ID from query parameters
        const category = await Category.findById(req.query.id);
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }
        
        // Update only provided fields, keep existing values for others
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to update category', error: err.message });
    }
};

/**
 * Delete a category by ID
 * 
 * @route DELETE /categories?id=categoryId
 * @access Sellers
 * 
 * No JSON input required
 * 
 * Example URL: DELETE http://localhost:3000/api/categories?id=507f1f77bcf86cd799439011
 */
exports.deleteCategory = async (req, res) => {
    const id = req.query.id;

    try {
        // Find category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Delete the category
        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get a single category by ID
 * 
 * @route GET /categories?id=categoryId
 * @access Sellers
 * 
 * No JSON input required
 * 
 * Example URL: GET http://localhost:3000/api/categories?id=507f1f77bcf86cd799439011
 */
exports.getCategoryById = async (req, res) => {
    const id = req.query.id;

    try {
        // Find category by ID
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};