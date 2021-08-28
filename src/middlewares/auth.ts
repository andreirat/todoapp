import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { Context } from "../interfaces/context";
import { JWT_SECRET } from "../config";

export const isAuthenticated: MiddlewareFn<Context> = ({context}, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const accessToken = authorization.split(" ")[1];
    context.accessTokenPayload = verify(accessToken, JWT_SECRET);
  } catch (e) {
    console.error(e);
  }

  return next();
}