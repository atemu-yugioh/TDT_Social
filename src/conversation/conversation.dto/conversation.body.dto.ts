import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsString } from "class-validator";
import { IsMongoId } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class CreateConversationDTO {
  @ApiProperty({
    type: String,
    description: "sender id (id of user)",
    example: "636a0d79a80422981359a56e",
  })
  @IsMongoId()
  sender: string;

  @ApiProperty({
    type: String,
    description: "recipient id (id of user)",
    example: "636a0d80a80422981359a571",
  })
  @IsMongoId()
  recipient: string;

  @ApiProperty({
    type: String,
    description: "text for message",
    example: "Chat text",
  })
  @IsString({
    message: "text phải là kiểu dữ liệu chuỗi",
  })
  text: string;

  @ApiProperty({
    type: String,
    description: "link media image or video",
    example: ["link media image or video"],
  })
  @IsString({ each: true, message: "Mỗi giá trị trong mảng phải là chuỗi" })
  media: Array<string>;
}
