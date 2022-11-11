import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class PostTDTQueryDTO {
  @ApiProperty({
    type: Number,
    description: "page",
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  page?: number = 1;

  @ApiProperty({
    type: Number,
    description: "limit",
    example: 20,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit?: number = 20;
}
