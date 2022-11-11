import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsMongoId } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class CreateCommentDTO {
  @ApiProperty({
    type: String,
    description: "post id",
    example: "6368bc322b4d5873ae4115fc",
  })
  @IsMongoId()
  post_id: string;

  @ApiProperty({
    type: String,
    description: "content coment's",
    example: "this is comment test",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: String,
    description: "tag user",
    example: "6368bc002b4d5873ae4115f9",
  })
  @IsString()
  tag: string;

  @ApiProperty({
    type: String,
    description: "reply comment",
    example: "6368c942d852104d7679b564",
  })
  @ApiProperty({
    type: String,
    description: "tag user",
    example: "",
  })
  @IsString()
  reply: string;

  @ApiProperty({
    type: String,
    description: "id user's post",
    example: "6368bc002b4d5873ae4115f9",
  })
  @IsMongoId()
  post_user_id: string;
}

export class UpdateCommentDTO {
  @ApiProperty({
    type: String,
    description: "content update",
    example: " this is content updated",
  })
  @IsString({})
  @IsNotEmpty()
  content: string;
}
