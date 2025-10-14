import express from "express";
import cors from "cors"
import cookieparser from "cookie-parser"
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/utils/swagger.js'
import UserRouter from './routes/user.route.js'

const app=express()

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}))

app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({extended:true,limit:"100kb"}))
app.use(express.static("public"))
app.use(cookieparser())
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use('/api/v1/user',UserRouter)


export {app}