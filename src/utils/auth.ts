import jwt, { JwtPayload } from "jsonwebtoken";

const tokenSecret = process.env.TOKEN_SECRET as string;

export const generateToken = ({ id, email }: { id: string; email: string }) => {
  return jwt.sign(
    {
      id,
      email,
    },
    tokenSecret,
    { expiresIn: "2d" }
  );
};

export const verifyToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  if (!decoded || !decoded.exp) return null;
  if (decoded.exp < Date.now() / 1000) return null;
  return decoded;
};
