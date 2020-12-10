// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();

const routes = require('./routes');

// Set up mongoose connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:32768/test';
const PORT = process.env.PORT || 3001;

mongoose.connect(MONGODB_URI, {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.disable("etag");

routes(app);

db.once('open', function() {
    console.log('Connected!');
    app.listen(PORT, () => {
        console.log('Server is up and running on port numner ' + PORT);
    });
});