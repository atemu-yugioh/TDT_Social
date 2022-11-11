import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
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
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/users/users.schema/users.schema";
import { GetUserFromToken } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { HttpExceptionFilter } from "src/utils.common/utils.exception.common/utils.exception.common";
import { BaseResponseData } from "src/utils.common/utils.response.common/utils.base.response.common";
import { CreateNotifyDTO } from "./notify.dto/notify.body.dto";
import { NotifyParamsDTO } from "./notify.dto/notify.params.dto";
import { NotifyDetailResponse } from "./notify.response/notify.response.detail";
import { Notify } from "./notify.schema/notify.schema";
import { NotifyService } from "./notify.service";

@Controller("notify")
@ApiTags("notify")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @ApiOperation({ summary: "get list notify" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Get()
  async getNotifies(
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const notifies: Notify[] = await this.notifyService.getNotifies(user);
    response.setData(new NotifyDetailResponse().maptoList(notifies));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "create notify" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Post()
  async createNotify(
    @GetUserFromToken() user: User,
    @Body() createNotifyDTO: CreateNotifyDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const newNotify: Notify = await this.notifyService.createNotify(
      user,
      createNotifyDTO
    );
    response.setData(new NotifyDetailResponse(newNotify));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete notify" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete("/:id")
  async deleteNotify(
    @GetUserFromToken() user: User,
    @Param() notifyParamsDTO: NotifyParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.notifyService.deleteNotify(user, notifyParamsDTO);
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete all notify" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete()
  async deleteAllNotify(
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.notifyService.deleteAllNotify(user);
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "is read notify" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id")
  async isReadNotify(
    @Param() notifyParamsDTO: NotifyParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const notify: Notify = await this.notifyService.isReadNotify(
      notifyParamsDTO
    );
    response.setData(new NotifyDetailResponse(notify));
    return res.status(HttpStatus.OK).send(response);
  }
}
