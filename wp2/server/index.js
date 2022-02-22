const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config()
const port = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// ROUTE SETUP
const tttRouter = require("./routes/tttRouter")
app.use('/', tttRouter)

const db = require('./db')
db.on('error', console.error.bind(console, 'MONGODB CONNECTION ERROR: '))

app.listen(port, () => {
    console.log(`Example App For Deploying Nginx SSL on port: ${port}`);
});
