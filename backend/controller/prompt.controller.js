import OpenAI from "openai"
import dotenv from 'dotenv'
import { Prompt } from "../model/user.prompt.js";

dotenv.config();

const API=process.env.OPENAI_API_KEY;
const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: API,
})


export const sendPrompt =async (req,res)=>{

    const {content}=req.body;
    const userId=req.userId;

    if(!content || content.trim()===""){
        return res.status(400).json({errors:"Prompt is required"})
    }

    try {

        //save the user prompt to the database
        const userPrompt=await Prompt.create({
            userId,
            role:"user",
            content,
        })

        //send to api
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: content }],
            model: "deepseek/deepseek-r1-0528:free",
        });

        const aiContent = completion.choices[0].message.content
        
        //save the AI response to the database
        const aiMessage=await Prompt.create({
            userId,
            role:"assistant",
            content: aiContent
        });

        return res.status(200).json({reply:aiContent})

    } catch (error) {
        console.log(error);    
        return res.status(400).json({errors:"error in code"})
    }
}
