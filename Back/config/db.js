import mongoose from "mongoose"

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://admin:kireeti@cluster0.cdfmllx.mongodb.net/snap-dish').then(()=>console.log("DB connected"))

}