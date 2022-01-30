import { NextFunction, Request, Response } from "express";
import session,{ SessionOptions } from 'express-session';
import connectMongo from "connect-mongo";

const sessionMiddleware =(req:Request, res:Response, next:NextFunction) => {

       return session({
        secret: 'keyboard cat',
        resave:false,
        saveUninitialized:true,
        store:connectMongo.create({
              mongoUrl:"mongodb://localhost:27017/smart-twitty"
        })
        
       })(req, res, next);
}

export default sessionMiddleware