const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require("./connection/db");
const path = require("path");
const cors = require("cors");
require("dotenv").config();


//database connection

dbConnection.authenticate().then(()=> {
  console.log("connected to Database Successfully");
}).catch((err)=> {
  console.error("unable to connect to database", err)
})

const app = express();
app.use(cors());

//use public folder to serve web pages
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

// api routes

app.use("/api/user", require("./api/user"));

app.get("/*", (req, res)=> res.sendFile(path.join(__dirname, "public/index.html")))



app.listen(process.eventNames.PORT || 3000, ()=> console.log("Server is running"))