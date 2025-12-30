import jwt from "jsonwebtoken";

export const verifyJWT = (token: string) => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET environment variable is not set");
  }
  return jwt.verify(token, secret);
};
