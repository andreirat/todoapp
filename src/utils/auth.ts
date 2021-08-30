import { sign, verify } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../config";
import { User } from "../entity/User";

function generateAccessToken(user: User, expiration: string = "1d"): any {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  }
  return sign(payload, JWT_SECRET, {expiresIn: expiration})
}

function generateRefreshToken(user: User, expiration: string = "30d"): any {
  const payload = {
    userId: user.id,
    tokenVersion: user.tokenVersion
  }
  return sign(payload, JWT_REFRESH_SECRET, {expiresIn: expiration})
}

function verifyRefreshToken(refreshToken: string): any {
  return verify(refreshToken, JWT_REFRESH_SECRET);
}

export {
  generateAccessToken,
  verifyRefreshToken,
  generateRefreshToken
}