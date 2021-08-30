import { Arg, Mutation, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { createTask, getUserTasks, updateTask, removeTask } from "../repositories/TasksRepository";
import { findOneBy } from "../repositories/UsersRepository";
import { findTaskBy } from "../repositories/TasksRepository";
import { TaskInput } from "../types/task";

import { Context } from "../interfaces/context";
import { isAuthenticated } from "../middlewares/auth";
import { UpdateTaskInput } from "../types/updateTask";

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
    @Arg("filter") filter: string,
    @Ctx() {accessTokenPayload}: Context
  ) {
    return await getUserTasks(accessTokenPayload.id, filter);
  }

  @Mutation(() => Task)
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
      throw new Error(err)
    }

    return {
      id: task.id,
      taskName: task.taskName,
      isCompleted: task.isCompleted
    };
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuthenticated)
  async updateTask(
    @Arg("input") taskInput: UpdateTaskInput,
    @Ctx() {}: Context
  ) {
    let task = await findTaskBy({where: {id: taskInput.id}}) as Task;
    try {
      await updateTask(taskInput, task)
    } catch (err) {
      throw new Error(err)
    }

    let updatedTask = await findTaskBy({where: {id: taskInput.id}}) as Task;

    return {
      id: updatedTask.id,
      taskName: updatedTask.taskName,
      isCompleted: updatedTask.isCompleted
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async removeTask(
    @Arg("taskId") taskId: number,
    @Ctx() {}: Context
  ) {
    try {
      await removeTask(taskId)
    } catch (err) {
      throw new Error(err)
    }

    return true;
  }
}