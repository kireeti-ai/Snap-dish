import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js"; // match file name and export
import foodRouter from "./routes/foodRoute.js"

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDb();
//api endponits
app.use('/images', express.static('uploads'))
app.use("/api/food",foodRouter)
app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`server on http://localhost:${port}`);
});

//mongodb+srv://kireetiv2005:FRvvr5gpOcr30ftF@cluster0.cdfmllx.mongodb.net/?