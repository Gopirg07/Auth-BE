const validator = require("validator");
const mongoose = require("mongoose"); 

let UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: (val) => {
      return validator.isEmail(val);
    },
  },
  phone: { type: String, default: "0000-00-0000" },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now() },
},
{
    collection:'users',
    versionKey:false,
}
);

let UserModel=mongoose.model('user',UserSchema)

module.exports={UserModel}