const express = require('express');
const app = express();
const port = 3000;
const dbconn = require('./database/db');
const cors = require('cors');
const multer = require('multer');
app.use(express.json());
app.use(cors());
app.use('/api', require('./routes/users'));
app.use('/blog', require('./routes/blogs'));
app.use('/category', require('./routes/categories'));
// Error handling middleware
app.use((req, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use('/uploads', express.static('uploads'));
app.use('/upload', require('./routes/uploads'));
app.listen(port, () => {
    console.log("Listening on port " + port);
});
