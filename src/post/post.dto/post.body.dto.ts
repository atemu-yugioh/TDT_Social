import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsString } from "class-validator";

export class CreatePostDTO {
  @ApiProperty({
    type: String,
    description: "content for post",
    example: "this is content of post",
  })
  @IsNotEmpty({
    message: "$property không được để trống",
  })
  content: string;

  @ApiProperty({
    type: Array<String>,
    description: "image for post",
    example: [
      "https://inkythuatso.com/uploads/images/2021/11/logo-tdtu-inkythuatso-01-25-14-39-31.jpg",
    ],
  })
  @IsString({ each: true, message: "Mỗi giá trị trong mảng phải là chuỗi" })
  @ArrayMinSize(1, {
    message: "Phải có ít nhất 1 ảnh.",
  })
  images: Array<string>;
}

export class UpdatePostDTO extends CreatePostDTO {}
