import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { Context } from "../interfaces/context";
import { JWT_SECRET } from "../config";

export const isAuthenticated: MiddlewareFn<Context> = ({context}, next) => {
  const authorization = context.req.headers['authorization']
  let accessTokenPayload = null;
  let message = "";

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const accessToken = authorization.split(" ")[1];
    accessTokenPayload = verify(accessToken, JWT_SECRET);
    context.accessTokenPayload = accessTokenPayload;
  } catch (e) {
    message = e.message;
    console.error(e.message);
  }

  if(message === "jwt expired"){
    throw new Error("Token expired");
  }

  if(!accessTokenPayload) {
    throw new Error("Not authenticated");
  }

  return next();
}