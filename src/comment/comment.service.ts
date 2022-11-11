import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostTDT } from "src/post/post.schema/post.schema";
import { PostService } from "src/post/post.service";
import { User } from "src/users/users.schema/users.schema";
import { ExceptionResponseDetail } from "src/utils.common/utils.exception.common/utils.exception.common";
import {
  CreateCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto/comment.body.dto";
import { CommentParamsDTO } from "./comment.dto/comment.params.dto";
import { Comment, CommentDocument } from "./comment.schema/comment.schema";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    private postService: PostService
  ) {}

  async createComment(
    user: User,
    createCommentDTO: CreateCommentDTO
  ): Promise<Comment> {
    const post: PostTDT = await this.postService.getDetailPost(
      createCommentDTO.post_id
    );

    if (!post) {
      throw new HttpException(
        new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "post not exist!"),
        HttpStatus.OK
      );
    }

    if (createCommentDTO.reply) {
      if (createCommentDTO.reply.length != 24) {
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.BAD_REQUEST,
            "reply comment invalid!"
          ),
          HttpStatus.OK
        );
      } else {
        const cm = await this.commentModel.findById(createCommentDTO.reply);
        if (!cm) {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              "comment not exist!"
            ),
            HttpStatus.OK
          );
        }
      }
    }

    let newComment: Comment = new this.commentModel({
      ...createCommentDTO,
      user: user,
    });

    await this.postService.pushComment(
      createCommentDTO.post_id,
      newComment._id
    );

    return (await newComment.save()).populate("user", "-password");
  }

  async updateComment(
    user: User,
    commentParamDTO: CommentParamsDTO,
    updateCommentDTO: UpdateCommentDTO
  ): Promise<any> {
    const comment: Comment = await this.commentModel.findOne({
      $and: [{ _id: commentParamDTO.id }, { user: user._id }],
    });

    if (!comment) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "comment not exist or you have't permission!"
        ),
        HttpStatus.OK
      );
    }

    const commentUpdated: Comment = await this.commentModel.findOneAndUpdate(
      { _id: commentParamDTO.id },
      updateCommentDTO,
      { returnOriginal: false }
    );
    return commentUpdated;
  }

  async likeComment(commentId: string, userId: string): Promise<Comment> {
    let comment: Comment = await this.commentModel.findOne({
      $and: [{ _id: commentId }, { likes: userId }],
    });

    if (comment) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "you liked this comment!."
        ),
        HttpStatus.OK
      );
    }

    let newComment: Comment = await this.commentModel
      .findOneAndUpdate(
        { _id: commentId },
        { $addToSet: { likes: userId } },
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .lean();

    return newComment;
  }

  async unlikeComment(commentId: string, userId: string): Promise<Comment> {
    const newComment: Comment = await this.commentModel
      .findOneAndUpdate(
        { _id: commentId },
        { $pull: { likes: userId } },
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .lean();

    if (!newComment) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "this post not exist!"
        ),
        HttpStatus.OK
      );
    }

    return newComment;
  }

  async deleteComment(postId: string): Promise<any> {
    return this.commentModel.deleteOne({ _id: postId });
  }
}
