import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsString } from "class-validator";

export class CreateNotifyDTO {
  @ApiProperty({
    type: String,
    description: "id for [post, comment, user]",
    example: "6368bc322b4d5873ae4115fc",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi",
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "recipients notify",
    example: ["6369d1f4f1a47d40eba2b74f"],
  })
  @IsString({ each: true, message: "Mỗi giá trị trong mảng phải là chuỗi" })
  @ArrayMinSize(1, {
    message: "Phải có ít nhất 1 người nhận thông báo.",
  })
  recipients: Array<string>;

  @ApiProperty({
    type: String,
    description: "url event to rederect",
    example: "/api/post/6368bc322b4d5873ae4115fc",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi",
  })
  url: string;

  @ApiProperty({
    type: String,
    description: "text for event [post,like post,comment, follow]",
    example: "this is content of post",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi",
  })
  text: string;

  @ApiProperty({
    type: String,
    description: "image for notify",
    example:
      "https://inkythuatso.com/uploads/images/2021/11/logo-tdtu-inkythuatso-01-25-14-39-31.jpg",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi",
  })
  image: string;

  @ApiProperty({
    type: String,
    description: "content for [post,comment...]",
    example: "this is content of post",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi",
  })
  content: string;
}
