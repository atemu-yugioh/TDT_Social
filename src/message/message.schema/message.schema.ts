import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { Conversation } from "src/conversation/conversation.schema/conversation.schema";
import { User } from "src/users/users.schema/users.schema";

export type MessageDocument = Message & Document;

@Schema({
  collection: "messages",
})
export class Message extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "conversations" })
  @Type(() => Conversation)
  conversation: Conversation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  recipient: User;

  @Prop({ type: String })
  text: String;

  @Prop({ type: Array<String> })
  media: string[];

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

const MessageSchema = SchemaFactory.createForClass(Message);

export { MessageSchema };
