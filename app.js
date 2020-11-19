//jshint esversion:

require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/login")
.get(function(req, res){
  res.render("login");
})

.post(function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        } else {

          res.render("login");
        }
      } else {
        res.render("login");
      }
    }
  })
});

app.route("/register")
.get(function(req, res){
  res.render("register");
})

.post(function(req, res){
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.render("secrets")
    }
  });
});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
