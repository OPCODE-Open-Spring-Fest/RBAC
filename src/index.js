// Entry point for RBAC authentication system

import connectDB from './config/dbconnection.js';
import {app} from './app.js';
import dotenv from 'dotenv';

dotenv.config();


connectDB().then(
  app.listen(process.env.PORT || 5000 ,()=>
  {
    console.log(`Server is running at port : ${process.env.PORT}`);
  })
).catch((err)=>
{
  console.log('database connection faield',err);
});