import { getConnection } from "typeorm";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { TaskInput } from "../types/task";

export async function findOneBy(query: any) {
  return await getConnection().getRepository(Task).findOne(query);
}

export async function createTask(payload: TaskInput, user: User) {
  const task = await getConnection().getRepository(Task).create(payload);
  task.user = user;
  return await getConnection().getRepository(Task).save(task);
}

export async function getAllTasks() {
  return await getConnection().getRepository(Task).find();
}

export async function getUserTasks(userId: number) {
  return await getConnection()
    .getRepository(Task)
    .createQueryBuilder("tasks")
    .leftJoinAndSelect("tasks.user", "user")
    .where('tasks.userId = :id', {id: userId})
    .getMany();
}