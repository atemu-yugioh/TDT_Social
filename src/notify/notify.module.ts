import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "src/auth/constants";
import { NotifyController } from "./notify.controller";
import { Notify, NotifySchema } from "./notify.schema/notify.schema";
import { NotifyService } from "./notify.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notify.name, schema: NotifySchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [NotifyService],
  exports: [NotifyService],
  controllers: [NotifyController],
})
export class NotifyModule {}
