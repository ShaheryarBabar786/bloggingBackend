const express= require('express');
const app = express();
const port=3000;
const dbconn=require('./database/db');
const cors = require('cors');
const multer=require('multer');


app.use(express.json());
app.use(cors());

app.use('/user',require('./routes/users'))
app.use('/admin',require('./routes/admin'))
app.use('/renter',require('./routes/renter'))
app.use('/product',require('./routes/product'))

app.use('/uploads', express.static('uploads'))
//uploads files
app.use('/upload', require('./routes/uploads'))
   

app.listen(port, () => {
    console.log("listening on port ");
});

