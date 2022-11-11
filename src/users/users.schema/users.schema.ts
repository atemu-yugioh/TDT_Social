import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({
  collection: "users",
})
export class User extends Document {
  @Prop({ type: String })
  full_name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    type: String,
    default:
      "https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-tdtu-inkythuatso-01-25-14-39-43.jpg",
  })
  avatar: string;

  @Prop({ type: String, default: "user" })
  role: string;

  @Prop({ type: String, default: "male" })
  gender: string;

  @Prop({ type: String, default: "" })
  mobile: string;

  @Prop({ type: String, default: "" })
  address: string;

  @Prop({ type: String, default: "" })
  story: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  followers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  following: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  saved: User[];
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
