import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class NotifyParamsDTO {
  @ApiProperty({
    type: String,
    description: "Id Notify",
    example: "635f51961665a3c44884706c",
  })
  @IsMongoId()
  id: string;
}
