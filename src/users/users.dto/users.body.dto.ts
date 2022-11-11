import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserBodyUpdateDTO {
  @ApiProperty({
    type: String,
    description: "avatar",
    example:
      "https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-tdtu-inkythuatso-01-25-14-39-43.jpg",
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    type: String,
    description: "full name",
    example: "Nguyen Van B",
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    type: String,
    description: "mobile",
    example: "033755678",
  })
  @IsString()
  mobile: string;

  @ApiProperty({
    type: String,
    description: "address",
    example: "303 Pham Van Dong",
  })
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    description: "story",
    example: "this is your story",
  })
  @IsString()
  story: string;

  @ApiProperty({
    type: String,
    description: "gender",
    example: "male",
  })
  @IsString()
  gender: string;
}
