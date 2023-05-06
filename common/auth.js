const bcrypt = require("bcryptjs");
const Salt_rounds = 10;
const jwt = require("jsonwebtoken"); 

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Salt_rounds);
  console.log(salt);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const hashCompare = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};

const createToken = async (payload) => {
  let token = await jwt.sign(payload, process.env.secretKey, { expiresIn: "2m" });
  return token;
};

const validate = async (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token);
    let currentTime = Math.floor(+new Date() / 1000);

    if (currentTime < data.exp) {
      next();
    } else {
      res.status(402).send({ message: "Token Has Expired" });
    }
  } else {
    res.status(400).send({
      message: "Token Not Found",
    });
  }
};

const roleCheck = async (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let data = await jwt.decode(token); 
    if (data.role === "admin") {
      next();
    }
    else 
    {
      res.status(402).send({message:"Only Admins Are Allowed"})
    }
  }
  else{
    res.status(400).send({message:"Token Not Found"})
  }
};

module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  validate,
  roleCheck,
};
