import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/users.schema/users.schema";

export type ConversationDocument = Conversation & Document;

@Schema({
  collection: "conversations",
})
export class Conversation extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  recipients: User[];

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

const ConversationSchema = SchemaFactory.createForClass(Conversation);

export { ConversationSchema };
