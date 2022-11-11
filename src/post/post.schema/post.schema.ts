import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { User, UserSchema } from "src/users/users.schema/users.schema";

export type PostTDTDocument = PostTDT & Document;

@Schema({
  collection: "posts",
})
export class PostTDT extends Document {
  @Prop({ type: String, default: "this is default conent" })
  content: string;

  @Prop({ type: Array<String>, default: [] })
  images: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  likes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] })
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  user: User;
}

const PostTDTSchema = SchemaFactory.createForClass(PostTDT);

export { PostTDTSchema };
