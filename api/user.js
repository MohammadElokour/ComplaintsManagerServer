const express = require("express");

const router = express.Router();


const UserModel = require("../model/UserModel");

const bcrypt = require("bcrypt");

const webToken = require("jsonwebtoken");


// Register API ***********************

router.post("/register", (req, res)=> {
  const {firstName, lastName, email, password, role} = req.body;

  if(firstName == undefined || firstName == '' || lastName == undefined || lastName == '' ||
    password == undefined || password == '' || email == undefined || email == '' || 
    role == undefined || role == '') {
      res.status(401).json({
        message: "please fill all the required fields",
        status: res.statusCode
      });
  } else {
    //check if email has already been registered before
    UserModel.findOne( { where: {email: email} } ).then((value) => {
      if(value == null) {
        //if no data found create a new record with hashed password
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, (err, hash) => {
            //create record of new user
            UserModel.create({
              first_name: firstName,
              last_name: lastName,
              email: email,
              password: hash,
              role: role
            }).then((value)=> {
              res.status(201).json({
                message: "Account has been Created Successfully!",
                status: res.statusCode
              })
            }).catch(err => res.status(500).json({
              message: "something went wrong",
              status: res.statusCode
            }))
          })
        })
      } else {
        res.status(401).json({
          message: "This email is taken",
          status: res.statusCode
        })
      }
    })
  }
})

// Login API ************************

router.post("/login", (req,res) => {

  const {email, password} = req.body;

  if(password == undefined || password == '' || email == undefined || email == '') {
      res.status(401).json({
        message: "please fill all the required fields",
        status: res.statusCode
      });
  } else {
    //check if email is present
    UserModel.findOne( { where: {email: email} } ).then((value) => {
      if(value == null) {
        //if no data found ask user to register
        res.status(401).json({
          message: "Password or email is Incorrect",
          status: res.statusCode,
          token: ""
        })
      } else {
        //if email is registered, check if password is correct
        const dbUserPassword = value.getDataValue('password');
        bcrypt.compare(password, dbUserPassword, function(err,result) {
          if(result) {
            //if password is correct send WebToken
            const userDetails = {
              id: value.getDataValue("id"),
              firstName: value.getDataValue("first_name"),
              lastName: value.getDataValue("last_name"),
              email: value.getDataValue("email"),
              role: value.getDataValue("role"),
            }

            const token = webToken.sign(userDetails, process.env.secret_key, {expiresIn: "6000s"})

            res.status(200).json({
              message: "Logged In Successfully!",
              status: res.statusCode,
              token
            })
          } else {
            //password does not match
            res.status(401).json({
              message: "Password or email is Incorrect",
              status: res.statusCode,
              token: ""
            })
          }
        })
      }
    })
  }

})


// get User Complaints API ************************
router.get("/complaints", (req, res)=> {
  const authHeader = req.headers["authorization"];

  if(authHeader) {
    //web token validation
    const token = authHeader.substr("Bearer".length +1)
    webToken.verify(token, process.env.secret_key, (err, user) => {
      // if data in the token send data
      if(user) {
        return res
        .status(200).json({
          message: "success!",
          status: res.statusCode,
          data: user
        })
      }
      // else ask user to login
      res.status(401).json({
        message: "Please Login",
        status: res.statusCode,
      })
      
    })

  } else {
    res.status(401).json({
      message: "Please Login",
      status: res.statusCode,
      token: ""
    })
  }
})




module.exports = router