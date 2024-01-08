// const express = require('express');
// const router = express.Router();
// const Uploads = require("../models/product").default;
// var multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
  
//     filename: function (req, file, cb) {
//       let name = file.originalname.split('.')
//       name = Date.now().toString() + '.' + name[name.length - 1]
//       cb(null, name)
//     },
//   })

// const upload = multer({ storage: storage })

// router.post('/multer', upload.single('fileSource'), (req, res) => {
//   res.json({ status: 1, fileName: req.file.filename })
//   console.log(res)
// })


module.exports =router;