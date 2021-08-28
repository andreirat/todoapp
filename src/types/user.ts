import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  @Length(6, 255)
  password: string;
}