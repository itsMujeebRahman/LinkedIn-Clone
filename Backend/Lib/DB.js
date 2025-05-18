import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connectd: ${conn.connection.host}`)
    }catch(error){
        console.error(`error connecting to MongoDB: ${error.message}`)
        process.exit(1);
    }
}