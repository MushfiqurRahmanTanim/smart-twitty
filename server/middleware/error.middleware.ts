


import { NextFunction, Request, Response,Express} from "express";
import { z } from 'zod';


// any error thrown by the process *eg throw new Error("blah") will not go to the function as it has 3 params instead it will go to the errorHandler (4 params) function
//https://expressjs.com/en/guide/error-handling.html
export function notFound(req, res, next: NextFunction) {
  const error = new Error(`NOT Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  if (error instanceof z.ZodError) {
    const errors = error.issues.map(err => err.message).join(',\n');
    
    return res.status(422).json({
      message: errors,
    });
  }
  
  res.status(statusCode);
  res.json({
    
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};

export const errorMiddleware = (app: Express) => {
  app.use(notFound);
  app.use(errorHandler);
};