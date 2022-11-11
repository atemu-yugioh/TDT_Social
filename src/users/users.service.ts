import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { RegisterDTO } from "src/auth/auth.dto/auth.body.dto";
import { ExceptionResponseDetail } from "src/utils.common/utils.exception.common/utils.exception.common";
import { UserBodyUpdateDTO } from "./users.dto/users.body.dto";
import { UserQueryDTO } from "./users.dto/users.query.dto";
import { UserDocument, User } from "./users.schema/users.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async createUser(user: RegisterDTO): Promise<User> {
    const newUser: User = new this.userModel(user);

    return newUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({ email })
      .populate("followers following", "-password")
      .lean();
  }

  async findById(id: string): Promise<User> {
    return this.userModel
      .findOne({ _id: id })
      .populate("followers following", "-password")
      .lean();
  }

  async search(userQueryDTO: UserQueryDTO): Promise<User[]> {
    let user: User[] = await this.userModel
      .find({
        $or: [
          { full_name: { $regex: new RegExp(userQueryDTO.key_word, "i") } },
          { mobile: { $regex: userQueryDTO.key_word } },
        ],
      })
      .limit(10)
      .populate("followers following", "-password")
      .lean();
    return user;
  }

  async update(
    id: string,
    userBodyUpdateDTO: UserBodyUpdateDTO
  ): Promise<User> {
    let userUpdated: User = await this.userModel
      .findOneAndUpdate({ _id: id }, userBodyUpdateDTO, {
        returnOriginal: false,
      })
      .populate("followers following", "-password");
    return userUpdated;
  }

  async follow(user: User, followerId: string): Promise<User> {
    if (user._id == followerId) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "you can't follow yoursel"
        ),
        HttpStatus.OK
      );
    }

    let infoUser: User = await this.userModel.findOne({
      _id: followerId,
      // followers: user._id,
    });

    if (!infoUser) {
      throw new HttpException(
        new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "User not exist!"),
        HttpStatus.OK
      );
    }

    if (infoUser.followers.includes(user._id)) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "You followed this user."
        ),
        HttpStatus.OK
      );
    }

    await this.userModel.findOneAndUpdate(
      {
        _id: followerId,
      },
      {
        $addToSet: { followers: user._id },
      }
    );

    const newUser: User = await this.userModel
      .findOneAndUpdate(
        { _id: user._id },
        {
          $addToSet: { following: followerId },
        },
        { returnOriginal: false }
      )
      .populate("followers following", "-password")
      .lean();

    return newUser;
  }

  async unFollow(user: User, followerId): Promise<User> {
    const newUser: User = await this.userModel
      .findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $pull: { following: followerId },
        },
        { returnOriginal: false }
      )
      .populate("followers following", "-password")
      .lean();

    await this.userModel.findOneAndUpdate(
      { _id: followerId },
      {
        $pull: { followers: user._id },
      },
      { returnOriginal: false }
    );
    return newUser;
  }

  async suggestionUsers(id: string): Promise<User[]> {
    const SUGGESTION_NUMBER = 10;

    let user: User = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new HttpException(
        new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "User not exist!"),
        HttpStatus.OK
      );
    }

    let newArr = [...user.following, user._id];

    const newUser: User[] = await this.userModel.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: SUGGESTION_NUMBER } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          pipeline: [{ $project: { password: 0 } }],
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          pipeline: [{ $project: { password: 0 } }],
          as: "following",
        },
      },
      {
        $project: {
          full_name: 1,
          email: 1,
          avatar: 1,
          gender: 1,
          mobile: 1,
          address: 1,
          story: 1,
          followers: 1,
          following: 1,
          saved: 1,
        },
      },
    ]);

    return newUser;
  }
}
