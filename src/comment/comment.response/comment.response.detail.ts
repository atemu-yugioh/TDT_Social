import mongoose from "mongoose";
import { User } from "src/users/users.schema/users.schema";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { Comment } from "../comment.schema/comment.schema";

export class CommentDetailResponse {
  content: string;
  tag: User | object;
  reply: String;
  likes: User[];
  user: User | object;
  post_user_id: String;
  created_at: String;
  updated_at: String;

  constructor(data?: Comment) {
    this.content = data?.content ? data.content : "";
    this.tag = data?.tag ? data.tag : {};
    this.reply = data?.reply ? data.reply.toString() : "";
    this.likes = data?.likes.length ? data.likes : [];
    this.user = data?.user ? data.user : {};
    this.post_user_id = data?.post_user_id ? data.post_user_id.toString() : "";
    this.created_at = data?.created_at
      ? UtilsDate.formatDateTimeVNToString(data.created_at)
      : "";
    this.updated_at = data?.updated_at
      ? UtilsDate.formatDateTimeVNToString(data.updated_at)
      : "";
  }

  public mapToList(data: Comment[]) {
    let response: CommentDetailResponse[] = [];
    data.forEach((e) => {
      response.push(new CommentDetailResponse(e));
    });
    return response;
  }
}
