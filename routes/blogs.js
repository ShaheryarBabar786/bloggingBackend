const router = require("express").Router();
const { auth } = require("../middleware/jwt");
const mongoose = require('mongoose');

const Blog = require('../models/blog'); // Import the Blog model
const Category = require('../models/category');

// Create a new blog
router.post('/create', async (req, res) => {
    try {
        const { name, description, mainHeading, image, category, type, categoryDescription } = req.body;

        if (!name) {
            return res.json({ status: 0, message: 'Name is required' });
        }

        // Check if the category exists or create a new one
        let categoryObj;
        if (category) {
            categoryObj = await Category.findOne({ name: category });
            if (!categoryObj) {
                categoryObj = new Category({ name: category, description: categoryDescription || '' });
                await categoryObj.save();
            }
        }

        // Create a new blog and associate it with the category
        const newBlog = new Blog({
            name,
            description,
            mainHeading, // Include the mainHeading
            image,
            category,
            type,
            categoryDescription,
            categoryId: categoryObj._id
        });
        const savedBlog = await newBlog.save();

        res.json({ status: 1, data: savedBlog });
    } catch (err) {
        console.error(err);
        res.json({ status: -1, message: err.message });
    }
});

//getall

router.get("/getAll", async (req, res) => {
    try {
        const data = await Blog.find({ status: { $in: "1" } }).sort("-createdAt");
        res.json({ status: 1, data })
    } catch (err) {
        res.json({ status: -1, message: "Something went wrong" });
    }
});

//get by id

router.get("/getById/:id", async (req, res) => {
    try {
        const data = await Blog.findById(req.params.id);
        res.json({ status: 1, data })
    } catch (err) {
        res.json({ status: -1, message: "Something went wrong" });
    }
});


router.get("/blog/getById/:id", async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ status: 0, message: "Invalid blog ID" });
        }

        const blog = await Blog.findOne({ _id: blogId, status: { $nin: "-1" } }).populate('category');


        if (blog) {
            return res.json({ status: 1, data: blog });
        } else {
            return res.json({ status: 0, message: "Blog not found" });
        }

    } catch (err) {
        return res.status(500).json({ status: -1, message: "Something went wrong" });
    }
});
//update
router.post('/update', async (req, res) => {
    console.log(req.body)
    try {

        let info = req.body
        const data = await Blog.findByIdAndUpdate(info._id, info, { new: true });
        // updatedUser = await User.findById(id)
        res.json({ status: 1, data })
    }
    catch (e) {
        res.json({ status: 0, message: e.message })
    }
})
router.post("/delete/:id", async (req, res) => {
    try {
        const data = await Blog.findByIdAndUpdate(req.params.id, { status: "-1" });
        res.json({ status: 1, data })
    } catch (err) {
        res.json({ status: -1, message: err.message });
    }
});
// search
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q; // Get the search term from query parameters
        const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex pattern

        const blogs = await Blog.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
            ],
            status: { $ne: "-1" }
        }).sort("-createdAt");

        res.json({ status: 1, data: blogs });
    } catch (err) {
        res.status(500).json({ status: -1, message: "Something went wrong" });
    }
});
router.get("/getByCategory/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ status: 0, message: "Invalid category ID" });
        }

        const blogs = await Blog.find({ categoryId, status: { $ne: "-1" } }).populate('category');

        if (blogs.length > 0) {
            res.json({ status: 1, data: blogs });
        } else {
            res.json({ status: 0, message: "No blogs found for this category" });
        }
    } catch (err) {
        res.status(500).json({ status: -1, message: "Something went wrong" });
    }
});

module.exports = router;
