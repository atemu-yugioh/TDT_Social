import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt } from "class-validator";
import { IsMongoId } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class MessageQueryDTO {
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

  @ApiProperty({
    type: String,
    description: "conversation id",
    example: "636b1e0e5afdef6aeb431522",
  })
  @IsMongoId()
  conversation_id: string;
}
