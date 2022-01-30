import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";


import sessionMiddleware from './middleware/session.middleware';

import connectDB from './configs/connectDB';
import { errorMiddleware } from './middleware/error.middleware';
import passport from './middleware/passport.middleware'



// Config DotEnv
dotenv.config();
// Port
const port = process.env.PORT || 8000;


const app = express();

// Connect MongoDB
connectDB();

//Bypassing CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials:true
  })
);
app.use(cookieParser());
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.session())
app.use(passport.initialize())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get('/', (req, res) => {
  res.send('Hello World');
 
});

// // Routes
// app.use('/api/user', userRoutes);

// error handlers
errorMiddleware(app)


// Log Server Connection
app.listen(port, () => console.log(`Server running on port ${port}`));
