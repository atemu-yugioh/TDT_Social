import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConstants } from "src/auth/constants";
import { MessageModule } from "src/message/message.module";
import { ConversationController } from "./conversation.controller";
import {
  Conversation,
  ConversationSchema,
} from "./conversation.schema/conversation.schema";
import { ConversationService } from "./conversation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
    forwardRef(() => MessageModule),
  ],
  providers: [ConversationService],
  exports: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
