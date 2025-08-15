import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import promptRoute from './routes/prompt.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const URL=process.env.MONGO_URL;

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"https://deepseek-ai-clone-git-main-holeom191-gmailcoms-projects.vercel.app",
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}))
//DB connection
try {
    mongoose.connect(URL)
        console.log("succesfully connected mongoose");
} catch (error) {
    console.log("Error: ");
}

//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/deepseekai",promptRoute)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
