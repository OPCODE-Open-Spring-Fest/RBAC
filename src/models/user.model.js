import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const  userschema=new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  password:{
    type:String,
    required:[true,'Password is required']
  },
  refreshToken:{
    type:String
  },
  refreshTokenExpiry:{
    type:Date
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  }
},{
  timestamps:true
});

userschema.pre('save', async function (next){
  if(!this.isModified('password'))return next();

  this.password=await bcrypt.hash(this.password,10);
  next();
});

userschema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password);
};

userschema.methods.genrateAccessToken = function () {
  try {
    if (!process.env.JWT_SECRET ) {
      throw new Error('Environment variables for token generation are missing');
    }

    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );
  } 
  catch (error) {
    throw new Error('Failed to generate access token');
  }
};

userschema.methods.refreshAccessToken = function () {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
      throw new Error('Environment variables for refresh token generation are missing');
    }

    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '10d',
      }
    );
  } 
  catch (error) {
    throw new Error('Failed to generate refresh token');
  }
};

userschema.methods.generateRefreshToken = function () {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      console.error('REFRESH_TOKEN_SECRET not set in environment variables');
      throw new Error('REFRESH_TOKEN_SECRET not set in environment');
    }

    const refreshToken = jwt.sign(
      {
        _id: this._id,
        type: 'refresh'
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
      }
    );

    // Set expiry date for database storage
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

    return { refreshToken, expiryDate };
  } 
  catch (error) {
    console.error('Refresh token generation error:', error.message);
    throw new Error(`Failed to generate refresh token: ${error.message}`);
  }
};

userschema.methods.clearRefreshToken = function () {
  this.refreshToken = undefined;
  this.refreshTokenExpiry = undefined;
  return this.save();
};


export const User=mongoose.model('User',userschema);