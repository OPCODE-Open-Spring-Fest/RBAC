import mongoose from "mongoose";

const connectDB=async ()=>{
    try {

        if(!process.env.MONGO_URI){
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(`${process.env.MONGO_URI}`)

        console.log(`\n mongodb connected`);

    } catch (error) {

        console.log("Mongodb connnection error : ",error);
        process.exit(1)
        
    }
}

export default connectDB;