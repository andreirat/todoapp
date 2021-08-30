import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity('tasks')
export class Task extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  taskName: string;

  @Field()
  @Column("bool", {default: false})
  isCompleted: boolean;

  @ManyToOne(() => User, user => user.tasks)
  user: User;
}
