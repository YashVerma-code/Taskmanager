import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const IsAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!jwtToken) {
    res
    .status(401)
    .send({ message: "Authorization token missing", success: false });
    return;
  }
  
  try {
    const decoded = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET_TOKEN as string
    ) as JwtPayload;

    console.log("JWT TOken : ", jwtToken);
    console.log("Decoded: ",decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error occured: ", error);
    res
      .status(500)
      .send({ message: "Invalid or expired token.", success: false });
    return;
  }
};
export default IsAuthenticated;
