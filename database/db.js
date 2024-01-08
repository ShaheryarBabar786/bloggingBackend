const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://shaheryarbabar:shaheryarbabar123456789@cluster0.njrzuoe.mongodb.net/Blogging-website", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("db connected...."))
    .catch((err) => console.log("db error...", err));
