import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateTaskInput {
  @Field()
  id: number

  @Field()
  taskName: string;

  @Field({defaultValue: false})
  isCompleted: boolean;
}