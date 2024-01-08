const mongoose = require('mongoose');
const express = require('express');

const schema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    category: { type: String },
    mainHeading: { type: String },
    categoryDescription: { type: String }, // Add this field
    image: { type: String },
    type: { type: String, enum: ['image', 'video'] },
    status: { type: String, default: "1" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' }
}, { timestamps: true });

const blog = mongoose.model('blog', schema);
module.exports = blog;