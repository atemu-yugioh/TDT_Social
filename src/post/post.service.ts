import { HttpException, HttpStatus, Injectable, Post } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/users.schema/users.schema";
import { ExceptionResponseDetail } from "src/utils.common/utils.exception.common/utils.exception.common";
import { APIfeatures } from "src/utils.common/utils.pagination.common/utils.pagination.common";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto/post.body.dto";
import { PostTDTQueryDTO } from "./post.dto/post.query.dto";
import { PostTDT, PostTDTDocument } from "./post.schema/post.schema";

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostTDT.name)
    private postModel: Model<PostTDTDocument>
  ) {}

  async createPost(user: User, createPostDTO: CreatePostDTO): Promise<PostTDT> {
    const newPost: PostTDT = new this.postModel({
      ...createPostDTO,
      user,
    });

    return (await newPost.save()).populate("user", "-password");
  }

  async getPosts(
    user: User,
    postTDTQueryDTO: PostTDTQueryDTO
  ): Promise<PostTDT[]> {
    const page = postTDTQueryDTO.page * 1 || 1;
    const limit = postTDTQueryDTO.limit * 1 || 9;
    const skip = (page - 1) * limit;
    let postTDTs: PostTDT[] = await this.postModel
      .find({
        user: [...user.following, user._id],
      })
      .skip(skip)
      .limit(limit)
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();
    return postTDTs;
  }

  async updatePost(
    postId: string,
    updatePostDTO: UpdatePostDTO
  ): Promise<PostTDT> {
    let postUpdated: PostTDT = await this.postModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        updatePostDTO,
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();

    return postUpdated;
  }

  async checkPostOwner(postId: string, userId: string): Promise<Boolean> {
    const post: PostTDT = await this.postModel.findOne({
      $and: [{ _id: postId }, { user: userId }],
    });

    if (!post) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "không phải là người sở hữu bài viết!"
        ),
        HttpStatus.OK
      );
    }
    return true;
  }

  async getDetailPost(postId: string): Promise<PostTDT> {
    const postDetail: PostTDT = await this.postModel
      .findOne({ _id: postId })
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();

    return postDetail;
  }

  async deletePost(postId: string): Promise<any> {
    return this.postModel.deleteOne({ _id: postId });
  }

  async likePost(postId: string, userId: string): Promise<PostTDT> {
    let post: PostTDT = await this.postModel.findOne({
      $and: [{ _id: postId }, { likes: userId }],
    });

    if (post) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "you liked this post!."
        ),
        HttpStatus.OK
      );
    }

    let newPost: PostTDT = await this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: userId } },
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();

    return newPost;
  }

  async unlikePost(postId: string, userId: string): Promise<PostTDT> {
    const postUpdated: PostTDT = await this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();

    if (!postUpdated) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "this post not exist!"
        ),
        HttpStatus.OK
      );
    }

    return postUpdated;
  }

  async pushComment(postId: String, commentId: String): Promise<PostTDT> {
    let newPost: PostTDT = await this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { $addToSet: { comments: commentId } },
        { returnOriginal: false }
      )
      .populate("user likes", "avatar full_name followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .lean();
    return newPost;
  }
}
