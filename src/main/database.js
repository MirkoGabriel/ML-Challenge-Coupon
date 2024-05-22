const mongoose = require('mongoose');

const URI = process.env.DB_URI;

mongoose.connect(URI, {
    useNewUrlParser: true, 

    useUnifiedTopology: true 
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB is connected')
});