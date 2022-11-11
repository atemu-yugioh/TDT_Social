import {
  Body,
  Controller,
  Delete,
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
import {
  CreateCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto/comment.body.dto";
import { CommentParamsDTO } from "./comment.dto/comment.params.dto";
import { CommentDetailResponse } from "./comment.response/comment.response.detail";
import { Comment } from "./comment.schema/comment.schema";
import { CommentService } from "./comment.service";

@ApiTags("Comment")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
@Controller("comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiOperation({ summary: "create comment" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Post()
  async createComment(
    @GetUserFromToken() user: User,
    @Body() createCommentDTO: CreateCommentDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const comment: Comment = await this.commentService.createComment(
      user,
      createCommentDTO
    );
    response.setData(new CommentDetailResponse(comment));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "update comment" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id")
  async updateComment(
    @Body() updateCommentDTO: UpdateCommentDTO,
    @Param() CommentParamsDTO: CommentParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const commentUpdated: Comment = await this.commentService.updateComment(
      user,
      CommentParamsDTO,
      updateCommentDTO
    );
    response.setData(new CommentDetailResponse(commentUpdated));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "like comment" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id/like")
  async likeComment(
    @Param() commentParamDTO: CommentParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const newComment: Comment = await this.commentService.likeComment(
      commentParamDTO.id,
      user._id
    );
    response.setData(new CommentDetailResponse(newComment));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "unlike comment" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id/unlike")
  async unlikeComment(
    @Param() commentParamDTO: CommentParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const newComment: Comment = await this.commentService.unlikeComment(
      commentParamDTO.id,
      user._id
    );
    response.setData(new CommentDetailResponse(newComment));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete comment" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete("/:id/delete")
  async deleteComment(
    @Param() commentParamDTO: CommentParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.commentService.deleteComment(commentParamDTO.id);
    return res.status(HttpStatus.OK).send(response);
  }
}
