import { Post } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/users.schema/users.schema";

export type CommentDocument = Comment & Document;

@Schema({
  collection: "comments",
})
export class Comment extends Document {
  @Prop({ type: String, require: true })
  content: string;

  @Prop({ type: Object, default: {} })
  tag: object;

  @Prop({ type: mongoose.Types.ObjectId })
  reply: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  likes: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  user: User;

  @Prop({ type: mongoose.Types.ObjectId })
  post_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  post_user_id: mongoose.Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updated_at: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

export { CommentSchema };
