import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Body,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { UserDetailResponse } from "src/users/users.response/users.response.detail";
import { User } from "src/users/users.schema/users.schema";
import { HttpExceptionFilter } from "src/utils.common/utils.exception.common/utils.exception.common";
import { BaseResponseData } from "src/utils.common/utils.response.common/utils.base.response.common";
import { LoginDTO, RegisterDTO } from "./auth.dto/auth.body.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("Auth")
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/register")
  @ApiOperation({ summary: "Register" })
  @ApiOkResponse({ description: "Success! " })
  @ApiBadRequestResponse({ description: "Bad Data! " })
  async register(
    @Body() subscribers: RegisterDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let newUser: User = await this.authService.register(subscribers);
    response.setData(new UserDetailResponse(newUser));
    return res.status(HttpStatus.OK).send(response);
  }

  @Post("/login")
  @ApiOperation({ summary: "Login" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad data !" })
  async login(@Body() loginData: LoginDTO, @Res() res: Response): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let user: User = await this.authService.login(loginData);
    response.setData(new UserDetailResponse(user));
    return res.status(HttpStatus.OK).send(response);
  }
}
