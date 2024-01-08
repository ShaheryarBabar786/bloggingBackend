const mongoose = require('mongoose');
const express = require('express');

const schema = new mongoose.Schema({
    name: { type: String },
    status: { type: String, default: '1' },
    description: { type: String },

    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'blog' }


}, { timestamps: true })



const category = mongoose.model('category', schema);
module.exports = category;