import { ApiProperty } from "@nestjs/swagger";
import { IsNegative, IsString } from "class-validator";

export class UserQueryDTO {
  @ApiProperty({
    type: String,
    description: "Tìm kiếm theo tên hoặc số điện thoại",
    example: "0909080809",
    required: false,
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi !",
  })
  key_word: string = "";
}
