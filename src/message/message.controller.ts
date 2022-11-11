import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { CreateMessageDTO } from "./message.dto/message.body.dto";
import { MessageParamsDTO } from "./message.dto/message.params.dto";
import { MessageQueryDTO } from "./message.dto/message.query.dto";
import { MessageResponseDetail } from "./message.response/message.response.detail";
import { Message } from "./message.schema/message.schema";
import { MessageService } from "./message.service";

@ApiTags("Message")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
@Controller("message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: "create message" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Post()
  async createMessage(
    @Body() createMessageDTO: CreateMessageDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const newMessage: Message = await this.messageService.createMessage(
      createMessageDTO
    );
    response.setData(new MessageResponseDetail(newMessage));
    res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "get message" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Get()
  async getMessage(
    @Query() messageQueryDTO: MessageQueryDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const messages: Message[] = await this.messageService.getMessages(
      messageQueryDTO
    );
    response.setData(new MessageResponseDetail().mapToList(messages));
    res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete message" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete("/:id")
  async deleteMessage(
    @GetUserFromToken() user: User,
    @Param() messageParamsDTO: MessageParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.messageService.deleteMessage(user._id, messageParamsDTO.id);
    res.status(HttpStatus.OK).send(response);
  }
}
