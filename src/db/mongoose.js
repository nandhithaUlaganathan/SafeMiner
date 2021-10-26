const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/safeminer',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    });

mongoose.connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});