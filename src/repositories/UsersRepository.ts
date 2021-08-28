import {getConnection} from "typeorm";
import {User} from "../entity/User";
import { UserInput } from "../types/user";

export async function findOneBy(query: any) {
  return await getConnection().getRepository(User).findOne(query);
}

export async function createUser(payload: UserInput) {
  const user = await getConnection().getRepository(User).create(payload);
  return await getConnection().getRepository(User).save(user);
}