import {
  Controller,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  Param,
  UseFilters,
  Query,
  Body,
  Patch,
} from "@nestjs/common";
import { response, Response } from "express";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { BaseResponseData } from "src/utils.common/utils.response.common/utils.base.response.common";
import { UsersService } from "./users.service";
import { User } from "./users.schema/users.schema";
import { UserDetailResponse } from "./users.response/users.response.detail";
import { HttpExceptionFilter } from "src/utils.common/utils.exception.common/utils.exception.common";
import { UserParamsDTO } from "./users.dto/users.params.dto";
import { UserQueryDTO } from "./users.dto/users.query.dto";
import { GetUserFromToken } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserBodyUpdateDTO } from "./users.dto/users.body.dto";

@Controller("users")
@ApiTags("User")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get("/search")
  @ApiOperation({ summary: "search user by name or mobile" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  async searchUser(
    @Query() userQueryDTO: UserQueryDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const users: User[] = await this.userService.search(userQueryDTO);
    response.setData(new UserDetailResponse().mapToList(users));
    res.status(HttpStatus.OK).send(response);
  }

  @Get("/:id")
  @ApiOperation({ summary: "get user by id" })
  @ApiOkResponse({ description: "Success! " })
  @ApiBadRequestResponse({ description: "Bad request! " })
  async getUser(
    @Param() userPramsDTO: UserParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let user: User = await this.userService.findById(userPramsDTO.id);
    response.setData(new UserDetailResponse(user));
    return res.status(HttpStatus.OK).send(response);
  }

  @Patch()
  @ApiOperation({ summary: "update info user" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad request! " })
  async updateUser(
    @Body() userBodyUpdateDTO: UserBodyUpdateDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let userUpdated: User = await this.userService.update(
      user._id,
      userBodyUpdateDTO
    );
    response.setData(new UserDetailResponse(userUpdated));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "follow someone" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad request!" })
  @Patch("/:id/follow")
  async follow(
    @Param() userParamsDTO: UserParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let newUser: User = await this.userService.follow(user, userParamsDTO.id);
    response.setData(new UserDetailResponse(newUser));
    res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "unfollow someone" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad request!" })
  @Patch("/:id/unfollow")
  async unFollow(
    @Param() userParamsDTO: UserParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let newUser: User = await this.userService.unFollow(user, userParamsDTO.id);
    response.setData(new UserDetailResponse(newUser));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "get suggestion users" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad request!" })
  @Patch("/suggestion")
  async suggestionUsers(
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let users: User[] = await this.userService.suggestionUsers(user._id);
    response.setData(new UserDetailResponse().mapToList(users));
    return res.status(HttpStatus.OK).send(response);
  }
}
