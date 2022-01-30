import { NextFunction, Request, Response } from "express";
import { ExtendedRequest } from "../libs/types";
export default async function (
  req:any,
  res:any,
  next: NextFunction
) {
  if (!req.user) {
    
    return res.status(401).json({ message: "Unauthenticated" });
    
  }

  next();
}
