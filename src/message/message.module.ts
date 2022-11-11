import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "src/auth/constants";
import { ConversationModule } from "src/conversation/conversation.module";
import { MessageController } from "./message.controller";
import { Message, MessageSchema } from "./message.schema/message.schema";
import { MessageService } from "./message.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
    forwardRef(() => ConversationModule),
  ],
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
