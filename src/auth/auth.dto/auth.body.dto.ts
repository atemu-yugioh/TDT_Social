import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsEmailTDT } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class RegisterDTO {
  @ApiProperty({
    type: String,
    description: "full name of user",
    example: "Nguyen Van A",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi.",
  })
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  full_name: string;

  @ApiProperty({
    type: String,
    description: "email for register.",
    example: "email@student.tdtu.edu.vn.",
  })
  @IsEmailTDT()
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  email: string;

  @ApiProperty({
    type: String,
    description: "password",
    example: "123456",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi.",
  })
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  @MinLength(6, {
    message: "[$property] quá ngắn, tối thiểu là $constraint1 kí tự.",
  })
  @MaxLength(18, {
    message: "[$property] quá dài, tối đa là $constraint1 kí tự.",
  })
  password: string;

  @ApiProperty({
    type: String,
    description: "gender",
    example: "male",
  })
  @IsString({
    message: "[$property] phải là kiểu chuỗi.",
  })
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  gender: string;
}

export class LoginDTO {
  @ApiProperty({
    type: String,
    description: "email for login.",
    example: "email@student.tdtu.edu.vn.",
  })
  @IsEmailTDT()
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  email: string;

  @ApiProperty({
    type: String,
    description: "password for login.",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty({
    message: "[$property] không được để trống.",
  })
  password: string;
}
