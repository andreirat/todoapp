import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || "4000";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshSecret";
export const HOST = process.env.HOST;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_URL = process.env.DATABASE_URL;
