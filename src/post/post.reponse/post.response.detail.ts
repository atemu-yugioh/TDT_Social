import e from "express";
import { User } from "src/users/users.schema/users.schema";
import { PostTDT } from "../post.schema/post.schema";

export class PostTDTDetailResponse {
  content: string;
  images: Array<string>;
  likes: User[];
  comments: Comment[];
  user: User;

  constructor(post?: PostTDT) {
    this.content = post?.content ? post.content : "";
    this.images = post?.images ? post.images : [];
    this.likes = post?.likes ? post.likes : [];
    this.comments = post?.comments ? post.comments : [];
    this.user = post?.user ? post.user : null;
  }

  public mapToList(data: PostTDT[]) {
    let response: PostTDTDetailResponse[] = [];
    data.forEach((e) => {
      response.push(new PostTDTDetailResponse(e));
    });

    return response;
  }
}
