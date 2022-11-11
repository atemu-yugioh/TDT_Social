import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isString,
  isNotEmpty,
  isMongoId,
} from "class-validator";
import { ExceptionResponseDetail } from "../utils.exception.common/utils.exception.common";

const FORMAT_EMAIL_TDT = ["tdtu.edu.vn", "student.tdtu.edu.vn"];

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isNotEmptyString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] không được để trống `
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isNotEmpty",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          typeof value === "string" && value.trim().length > 0,
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] không được để trống `
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsInt(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isInt",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => !isNaN(value) || !value,
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] phải là kiêu số nguyên!`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsEmailTDT(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: "isEmailTDT",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          const formatEmail = value.split("@")[1];
          return FORMAT_EMAIL_TDT.includes(formatEmail);
        },
        defaultMessage: (): string => {
          return `email phải có định dạng "@tdtu.edu.vn" hoặc "@student.tdtu.edu.vn"`;
        },
      },
    });
  };
}

export function IsMongoId(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isMongoId",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => isMongoId(value),
        defaultMessage: (): string => `[$property] phải dài 24 kí tự`,
      },
    });
  };
}

export const GetUserFromToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new ExceptionResponseDetail(
        HttpStatus.UNAUTHORIZED,
        "Không đủ quyền để thực hiện"
      );
    }

    return request.user;
  }
);
