import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose; 

const FarmerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farmer Name is required"],
  },
  phonenumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "Phone number already exists"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  plots: [{
    type: Schema.Types.ObjectId,
    ref: 'Plot'
  }]
}, {
  timestamps: true,
});


FarmerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



FarmerSchema.methods.isPassWordCorrect = async function (password) {
  console.log(password)
  return await bcrypt.compare(password, this.password);
};


FarmerSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);

export default Farmer;
