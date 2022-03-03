const express = require("express")
// const cors = require("cors")
const cookieParser = require('cookie-parser')
const session = require("express-session")
const MongoDBSession = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')

// ENV SETUP
dotenv.config()

// DEFINITIONS
const port = process.env.PORT || 3000
const app = express()

// DB CONNECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MONGODB CONNECTION ERROR: '))

// DB SESSION
const store = new MongoDBSession({
    uri: process.env.DB_CONNECT,
    collection: 'userSessions'
})

// USES
app.use(express.urlencoded({extended: true}));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Session Config
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store
}))

// ROUTE SETUP
const tttRouter = require("./routes/tttRouter")
const userRouter = require("./routes/userRouter")
app.use('/', tttRouter)
app.use('/', userRouter)


// STARTING POINT
app.listen(port, () => {
    
});
