import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { CreatePostDTO, UpdatePostDTO } from "./post.dto/post.body.dto";
import { PostTDTParamsDTO } from "./post.dto/post.params.dto";
import { PostTDTQueryDTO } from "./post.dto/post.query.dto";
import { PostTDTDetailResponse } from "./post.reponse/post.response.detail";
import { PostTDT } from "./post.schema/post.schema";
import { PostService } from "./post.service";

@ApiTags("Post")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
@UseFilters(HttpExceptionFilter)
@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOperation({ summary: "create post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Post()
  async create(
    @Body() createPostDTO: CreatePostDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let post: PostTDT = await this.postService.createPost(user, createPostDTO);
    response.setData(new PostTDTDetailResponse(post));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "get list post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Get()
  async getPosts(
    @Query() postTDTQueryDTO: PostTDTQueryDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let listPost: PostTDT[] = await this.postService.getPosts(
      user,
      postTDTQueryDTO
    );
    response.setData(new PostTDTDetailResponse().mapToList(listPost));
    res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "get post detail" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Get("/:id")
  async getDetailPost(
    @Param() postTDTParamsDTO: PostTDTParamsDTO,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let postDetail: PostTDT = await this.postService.getDetailPost(
      postTDTParamsDTO.id
    );
    response.setData(new PostTDTDetailResponse(postDetail));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "update post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id")
  async updatePost(
    @Param() postParamsDTO: PostTDTParamsDTO,
    @Body() updatePostDTO: UpdatePostDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    await this.postService.checkPostOwner(postParamsDTO.id, user._id);
    let postUpdated: PostTDT = await this.postService.updatePost(
      postParamsDTO.id,
      updatePostDTO
    );
    response.setData(new PostTDTDetailResponse(postUpdated));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "delete post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Delete("/:id")
  async deletePost(
    @Param() postTDTParamsDTO: PostTDTParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    await this.postService.checkPostOwner(postTDTParamsDTO.id, user._id);
    const response: BaseResponseData = new BaseResponseData();
    await this.postService.deletePost(postTDTParamsDTO.id);
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "like post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id/like")
  async LikePost(
    @Param() postTDTParamsDTO: PostTDTParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    let post: PostTDT = await this.postService.likePost(
      postTDTParamsDTO.id,
      user._id
    );
    response.setData(new PostTDTDetailResponse(post));
    return res.status(HttpStatus.OK).send(response);
  }

  @ApiOperation({ summary: "unlike post" })
  @ApiOkResponse({ description: "Success" })
  @ApiBadRequestResponse({ description: "Bad Request! " })
  @Patch("/:id/unlike")
  async unlikePost(
    @Param() postTDTParamsDTO: PostTDTParamsDTO,
    @GetUserFromToken() user: User,
    @Res() res: Response
  ): Promise<any> {
    const response: BaseResponseData = new BaseResponseData();
    const postUpdated: PostTDT = await this.postService.unlikePost(
      postTDTParamsDTO.id,
      user._id
    );
    response.setData(postUpdated);
    return res.status(HttpStatus.OK).send(response);
  }
}
