import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"
import path from "path"
import { fileURLToPath } from "url"
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port =process.env.PORT

const app=express()

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/",router)

app.use((err,req,res,next)=>{
  console.log(err)

  if(err.status){
    return res.status(err.status).json(err.data)
  }

  return res.status(500).json({message:`agent error ${error}`})
})


app.get("/",(req,res)=>{
    res.json({message:"hello from agent"})
})

app.listen(port,()=>{
    console.log(`agent started at ${port}`)
    connectDb()
})
