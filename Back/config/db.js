import mongoose from "mongoose";

export const connectDb = async () => {

    await mongoose.connect('mongodb+srv://kireetiv2005:FRvvr5gpOcr30ftF@cluster0.cdfmllx.mongodb.net/FoodCommerceApp').then(() => console.log("database connected"))
        .catch(err => console.error("DB connection error:", err));
};
