import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/users.schema/users.schema";

export type NotifyDocument = Notify & Document;

@Schema({
  collection: "Notify",
})
export class Notify extends Document {
  @Prop({ type: mongoose.Types.ObjectId })
  id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  @Type(() => User)
  user: User;

  @Prop({ type: [mongoose.Types.ObjectId] })
  recipients: mongoose.Types.ObjectId[];

  @Prop({ type: String })
  url: String;

  @Prop({ type: String })
  text: String;

  @Prop({ type: String })
  content: String;

  @Prop({ type: String })
  image: String;

  @Prop({ type: Boolean, default: false })
  is_read: boolean;

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

const NotifySchema = SchemaFactory.createForClass(Notify);

export { NotifySchema };
