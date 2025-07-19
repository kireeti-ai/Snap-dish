import foodModel  from "../model/foodModel.js";
import fs from 'fs'


const addFood = async(req,res)=>{
    if (!req.file) {
  return res.status(400).json({ success: false, message: "No file uploaded" });
}
let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true,message:"Food added"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"error"})
    }
}
export {addFood}