import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { registerAs } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument, User } from "src/users/users.schema/users.schema";
import { UsersService } from "src/users/users.service";
import { ExceptionResponseDetail } from "src/utils.common/utils.exception.common/utils.exception.common";
import { Password } from "src/utils.common/utils.password.common/utils.password.common";
import { LoginDTO, RegisterDTO } from "./auth.dto/auth.body.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(subscribers: RegisterDTO): Promise<User> {
    const user: User = await this.userService.findByEmail(subscribers.email);

    if (user) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "Email đã được sử dụng!"
        ),
        HttpStatus.OK
      );
    }

    let passwordHashed: string = await Password.bcryptPassword(
      subscribers.password
    );

    return this.userService.createUser({
      ...subscribers,
      password: passwordHashed,
    });
  }

  async login(loginData: LoginDTO): Promise<User> {
    const user: User = await this.userService.findByEmail(loginData.email);

    if (!user) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "This email does not exist!"
        ),
        HttpStatus.OK
      );
    }

    const isMatch = await Password.comparePassword(
      loginData.password,
      user.password
    );

    if (!isMatch) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.BAD_REQUEST,
          "Password invalid!"
        ),
        HttpStatus.OK
      );
    }

    return user;
  }
}
