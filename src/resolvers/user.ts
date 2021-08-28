import { Arg, Mutation, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { createUser, findOneBy } from "../repositories/UsersRepository";

import { UserInput } from "../types/user";
import { User } from "../entity/User";
import { LoginResponse } from "../types/login";
import { generateRefreshToken, generateAccessToken, verifyRefreshToken } from "../utils/auth";
import { LoginInput } from "../types/auth";
import { Context } from "../interfaces/context";
import { isAuthenticated } from "../middlewares/auth";

@Resolver()
export class UserResolver {

  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  revokeAccess(
    @Ctx() {}: Context
  ) {
    return;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("input") loginInput: LoginInput,
    @Ctx() {res}: Context
  ): Promise<LoginResponse> {
    const user = await findOneBy({where: {email: loginInput.email}})

    if (!user) {
      throw new Error("Could not find user")
    }

    const valid = await compare(loginInput.password, user.password)

    if (!valid) {
      throw new Error("Invalid Credentials")
    }

    // Generate an set refresh token in cookie
    const refreshToken = generateRefreshToken(user)
    res.cookie('rtid', refreshToken, {httpOnly: true})

    return {
      accessToken: generateAccessToken(user)
    }
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Ctx() {req, res}: Context
  ) {
    const refreshToken = req.cookies.rtid;

    if (!refreshToken) {
      return {accessToken: null};
    }
    let response = null;
    try {
      response = verifyRefreshToken(refreshToken);
    } catch (e) {
      console.error(e);
      return {accessToken: null};
    }

    const user = await User.findOne({id: response.userId})

    if (!user) {
      return {accessToken: null};
    }

    // Check if the current user has the same refresh token saved
    if (user.tokenVersion !== refreshToken.tokenVersion) {
      return {accessToken: null};
    }

    // Set refresh token in cookie
    res.cookie('rtid', refreshToken, {httpOnly: true})
    return {accessToken: generateAccessToken(user)};
  }

  @Mutation(() => Boolean)
  async register(@Arg("input") userInput: UserInput) {
    const encryptedPassword = await hash(userInput.password, 12)

    try {

      await createUser({
        ...userInput,
        password: encryptedPassword
      })

    } catch (err) {
      console.log(err)
      return false;
    }

    return true;
  }
}