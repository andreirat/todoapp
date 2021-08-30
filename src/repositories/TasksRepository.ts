import { getConnection } from "typeorm";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { TaskInput } from "../types/task";

export async function findTaskBy(query: any) {
  return await getConnection().getRepository(Task).findOne(query);
}

export async function createTask(payload: TaskInput, user: User) {
  const task = await getConnection().getRepository(Task).create(payload);
  task.user = user;
  return await getConnection().getRepository(Task).save(task);
}

export async function updateTask(payload: TaskInput, task: Task) {
  return await getConnection()
    .createQueryBuilder()
    .update(Task)
    .set({isCompleted: payload.isCompleted, taskName: payload.taskName})
    .where("id = :id", {id: task.id})
    .execute();
}

export async function removeTask(taskId: number) {
  return await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Task)
    .where("id = :id", {id: taskId})
    .execute();
}

export async function getUserTasks(userId: number, filter: string) {
  let query = getConnection()
    .getRepository(Task)
    .createQueryBuilder("tasks")
    .leftJoinAndSelect("tasks.user", "user")
    .where('tasks.userId = :id', {id: userId})
    .addOrderBy("tasks.id", "DESC")

  if (filter === "Completed") {
    query.andWhere('tasks.isCompleted = :isCompleted', {isCompleted: true})
  }

  if (filter === "Incompleted") {
    query.andWhere('tasks.isCompleted = :isCompleted', {isCompleted: false})
  }

  return await query.getMany();
}