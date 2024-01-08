const router = require('express').Router();
const Category = require('../models/category');

//create
router.post('/create', async (req, res) => {
    try {
        const { name, description, blogId } = req.body;
        if (!name) {
            return res.json({ status: 0, message: 'Name is required' });
        }
        const newCategory = new Category({ name, description, blogId });
        const savedCategory = await newCategory.save();
        res.json({ status: 1, data: savedCategory });
    } catch (err) {
        console.error(err);
        res.json({ status: -1, message: err.message });
    }
});
//get All
router.get("/getAll", async (req, res) => {
    try {
        const categories = await Category.find({ status: { $ne: "-1" } }).sort({ createdAt: -1 });
        if (!categories || categories.length === 0) {
            return res.status(404).json({ status: 0, message: 'No categories found' });
        }
        res.status(200).json({ status: 1, data: categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: -1, message: 'Something went wrong' });
    }
});
//delete
router.post('/delete/:id', async (req, res) => {
    try {
        const categoryId = req.params.id; // Extract the ID
        console.log('Deleting category with ID:', categoryId);
        const updatedUser = await Category.findByIdAndUpdate(
            categoryId, // Use categoryId
            { status: -1 },
            { new: true }
        );
        console.log('Updated category:', updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ status: 0, message: 'Category not found' });
        }
        res.json({ status: 1, data: updatedUser, message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: -1, message: err.message });
    }
});

//search

router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q; // Get the search term from query parameters
        const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex pattern

        const categories = await Category.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
                // Include other fields you want to search
            ],
            status: { $ne: "-1" }
        }).sort("-createdAt");

        res.json({ status: 1, data: categories });
    } catch (err) {
        res.status(500).json({ status: -1, message: "Something went wrong" });
    }
});






module.exports = router;