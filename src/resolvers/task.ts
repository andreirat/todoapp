import { Arg, Mutation, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { createTask, getUserTasks } from "../repositories/TasksRepository";
import { findOneBy } from "../repositories/UsersRepository";
import { TaskInput } from "../types/task";

import { Context } from "../interfaces/context";
import { isAuthenticated } from "../middlewares/auth";

@Resolver()
export class TaskResolver {

  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  revokeAccess(
    @Ctx() {}: Context
  ) {
    return;
  }

  @Query(() => [Task])
  @UseMiddleware(isAuthenticated)
  async getUserTasks(
    @Ctx() {accessTokenPayload}: Context
  ) {
    return await getUserTasks(accessTokenPayload.id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async createTask(
    @Arg("input") taskInput: TaskInput,
    @Ctx() {accessTokenPayload}: Context
  ) {
    const user = await findOneBy({where: {id: accessTokenPayload.id}}) as User;

    let task = null;
    try {
      task = await createTask(taskInput, user)
    } catch (err) {
      return false;
    }
    return {
      id: task.id,
      taskName: task.taskName,
      isCompleted: task.isCompleted
    };
  }
}