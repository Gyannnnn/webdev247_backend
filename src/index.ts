require('dotenv').config()
import express from "express"
const app = express()
import cors from 'cors'



import notionRouter from "./routes/notion.routes";
import blogRouter from "./routes/blogs.routes";
import authorRouter from "./routes/author.routes";



app.use(express.json());
app.use(cors())





app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Welcome to blog api",
        version:"1.0.0",
        dev:"Gyanaranjan Patra"
    })
})


app.use("/api/v1/notion/blogs",notionRouter);
app.use("/api/v1/blogs",blogRouter);
app.use("/api/v1/author",authorRouter);



app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running @ http://localhost:${process.env.PORT || 3000}`)
})