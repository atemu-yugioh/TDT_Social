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
import { response, Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/users/users.schema/users.schema";
import { GetUserFromToken } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { HttpExceptionFilter } from "src/utils.common/utils.exception.common/utils.exception.common";
import { BaseResponseData } from "src/utils.common/utils.response.common/utils.base.response.common";
import { CreateConversationDTO } from "./conversation.dto/conversation.body.dto";
import { ConversationParamsDTO } from "./conversation.dto/conversation.params.dto";
import { ConversationQueryDTO } from "./conversation.dto/conversation.query.dto";
import { ConversationResponseDetail } from "./conversation.response/conversation.response.detail";
import { Conversation } from "./conversation.schema/conversation.schema";
import { ConversationService } from "./conversation.service";

@ApiTags("Conversation")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
@Controller("conversation")
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @ApiOperation({ summary: "create conversation" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Post()
  async createConversation(
    @Body() createConversationDTO: CreateConversationDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const conversation: Conversation =
      await this.conversationService.createConversation(createConversationDTO);
    response.setData(new ConversationResponseDetail(conversation));
    res.status(HttpStatus.OK).send(conversation);
  }

  @ApiOperation({ summary: "get conversation" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Get("/:id")
  async getConversation(
    @GetUserFromToken() user: User,
    @Query() conversationQueryDTO: ConversationQueryDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const conversations: Conversation[] =
      await this.conversationService.getConversation(
        user,
        conversationQueryDTO
      );
    response.setData(new ConversationResponseDetail().mapToList(conversations));
    res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete conversation" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete("/:id")
  async deleteConversation(
    @GetUserFromToken() user: User,
    @Param() conversationParamsDTO: ConversationParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.conversationService.deleteConversation(
      user,
      conversationParamsDTO
    );
    res.status(HttpStatus.OK).send(response);
  }
}
