import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class CommentParamsDTO {
  @ApiProperty({
    type: String,
    description: "Id Comment",
    example: "635f51961665a3c44884706c",
  })
  @IsMongoId()
  id: string;
}
