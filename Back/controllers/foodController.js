import foodModel from "../model/foodModel.js";
import fs from 'fs';

// The 'addFood' function defines 'req' and 'res' as its parameters.
const addFood = async (req, res) => {
    // This check must be inside the function.
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // This line must be inside the function to access req.file.
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });
    try {
        await food.save(); // This line is failing
        res.json({ success: true, message: "Food added" });
    } catch (error) {
        console.log(error); // The detailed error is printed in your terminal
        res.json({ success: false, message: "error" }); // This is the response you see
    }
};

export { addFood };