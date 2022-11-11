import * as jwt from "jsonwebtoken";

export interface jwtPayloadI {
  email: string;
}

export class UtilsJwt {
  constructor() {}

  static createAccessToken = (payload: jwtPayloadI): string => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  };

  static createRefreshToken = (payload: jwtPayloadI): string => {
    return jwt.sign(payload, process.env.REFRESH_ACCESS_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  };
}
