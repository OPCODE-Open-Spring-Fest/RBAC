import mongoose from "mongoose";

const connectDB=async ()=>{
    try {

        if(!process.env.MONGO_URI){
            console.warn('MONGO_URI not found in .env - database features will be unavailable');
            return;
        }

        await mongoose.connect(`${process.env.MONGO_URI}`)

        console.log(`\n mongodb connected`);

    } catch (error) {

        console.warn("Mongodb connection error - database features will be unavailable:",error.message);
        
    }
}

export default connectDB;