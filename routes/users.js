var express = require("express");
var router = express.Router();
const { UserModel } = require("../Schemas/UserSchema");
const mongoose = require("mongoose");
const { dbUrl } = require("../common/dbconfig");

const { hashPassword, hashCompare, createToken, validate, roleCheck } = require("../common/auth");
mongoose.connect(dbUrl);

/* GET users listing. */
//GET All
router.get("/getAll",validate,roleCheck,async function (req, res) {
  try {
    let users = await UserModel.find();
    res.status(200).send({
      users,
      message: "Users Data Fetch Successfull!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//SignUp
router.post("/signup", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let user = await UserModel.create(req.body);
      res.status(201).send({
        message: "User Signup Successfull!",
      });
    }
    else {
      res.status(400).send({ message: "User Alread Exists!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        let token=await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role,
        })
        res.status(200).send({
          message: "User Login Successfully!",
          token
        });
      } else {
        res.status(402).send({ message: "Invalid Credentials!" });
      }
    } else {
      res.status(400).send({ message: "User Doesn't Exists!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//GET By ID
router.get("/get/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    res.status(200).send({
      message: "user data fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
      err,
    });
  }
});

//Update By ID
router.put("/update/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id }); 
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password; 

      await user.save();

      res.status(200).send({
        message: "user data Updated successfully",
        user,
      });
    } 
    else {
      res.status(400).send({
        message: "User Doesn't Exists",
        error: error,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Errors",
      err:err,
    });
  }
});

//DELETE By ID
router.delete("/delete/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    if (user) {
      let deleteUser = await UserModel.deleteOne({ _id: req.params.id });
      res.status(200).send({
        message: "user data deleted successfully",
        deleteUser,
      });
    } else {
      res.status(400).send({
        message: "User Doesn't Exists",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
      err,
    });
  }
});

module.exports = router;
